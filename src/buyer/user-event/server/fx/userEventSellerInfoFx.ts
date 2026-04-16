/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
import { Effect } from "effect";
import { clamp } from "@/lib/common/clamp";
import { getLoggerFx } from "@/lib/common/log";
import { median } from "@/lib/common/median";
import { p90 } from "@/lib/common/p90";
import type { UserEventSellerSchema } from "~/buyer/user-event/server/schema/UserEventSellerSchema";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";
import { computeActivityFx } from "~/user/user-event/server/fx/computeActivityFx";
import { computeLoad } from "~/user/user-event/server/fx/computeLoad";
import { userEventCollectionFx } from "~/user/user-event/server/fx/userEventCollectionFx";
import type { ActivityEnumSchema } from "~/user/user-event/server/schema/ActivityEnumSchema";
import type { LoadEnumSchema } from "~/user/user-event/server/schema/LoadEnumSchema";

export namespace userEventSellerInfoFx {
	export interface Props {
		userId: string;
	}
}

/**
 * Computes seller reaction metrics.
 *
 * @note Tracks how quickly sellers respond when buyers create transactions, and whether they
 *          react at all before the buyer closes/rejects (terminal).
 * @note This is a soft metric used to tell buyers if seller reacts and how long
 *          it usually takes.
 *
 * Flow tracked:
 * 1. transaction.create (foreign scope) - counts total (buyer creates transaction)
 * 2. transaction.open (user scope) - starts reaction window (records createAtMs)
 * 3a. If transaction.closed/rejected (foreign scope) before seller reacts -> terminal
 * 3b. If transaction.message/open/closed/rejected (user scope) after create -> reaction (records delta from create)
 */
export const computeSellerReaction = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (foreign)
	let reactions = 0;
	let terminal = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let createAtMs: number | null = null;
	let done = false; // group resolved (reacted or terminal)

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		createAtMs = null;
		done = false;
	};

	const isBuyerTerminal = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isSellerReaction = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.open" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all transactions created by buyers (foreign scope) per group
		if (event.event === "transaction.create" && event.scope === "foreign") {
			if (!created) {
				created = true;
				total++;
				createAtMs = createdAt;
			}
			continue;
		}

		if (!created || done) continue;

		// buyer ended before seller could react
		if (isBuyerTerminal(event)) {
			if (createAtMs != null && createdAt >= createAtMs) {
				terminal++;
				done = true;
			}
			continue;
		}

		// first seller reaction after create => reacted (open OR message OR close/reject)
		if (isSellerReaction(event)) {
			if (createAtMs == null) continue;
			if (createdAt < createAtMs) continue;

			reactions++;
			deltasMs.push(createdAt - createAtMs);
			done = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		reactions,
		terminal,
		percent: total === 0 ? 0 : ((reactions + terminal) / total) * 100,
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
	} satisfies UserEventSellerSchema.Type["reaction"];
};

/**
 * Computes seller rejected metrics (transactions rejected without interaction).
 *
 * @note Tracks transactions where sellers reject them directly without any back-and-forth
 *          interaction (messages, negotiations, etc.).
 * @note This is a hard metric telling buyers how often seller rejects the
 *          transaction without _any_ interaction.
 *
 * Flow tracked:
 * 1. transaction.create (foreign scope) - counts total (buyer creates transaction, records createAtMs)
 * 2. Any interaction event between create and reject (e.g., transaction.message) -> marks as dirty
 * 3. transaction.rejected (user scope) - if not dirty, counts as rejected (records delta from create)
 */
export const computeSellerRejected = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (foreign)
	let rejected = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let createAtMs: number | null = null;

	let dirty = false;
	let done = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		createAtMs = null;

		dirty = false;
		done = false;
	};

	const isSellerRejected = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.rejected" && event.scope === "user";

	const isInteraction = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.message" ||
		event.event === "transaction.open" ||
		event.event === "transaction.closed" ||
		event.event === "transaction.success";

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		if (event.event === "transaction.create" && event.scope === "foreign") {
			if (!created) {
				created = true;
				total++;
			}

			if (createAtMs === null) {
				createAtMs = createdAt;
			}
			continue;
		}

		if (createAtMs == null) {
			continue;
		}
		if (createdAt < createAtMs) {
			continue;
		}
		if (done) {
			continue;
		}

		// seller rejected the transaction
		if (isSellerRejected(event)) {
			done = true;

			if (!dirty) {
				rejected++;
				deltasMs.push(createdAt - createAtMs);
			}
			continue;
		}

		// any interaction between create and reject makes it dirty
		if (isInteraction(event)) {
			dirty = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		rejected,
		percent: total === 0 ? 0 : (rejected / total) * 100,
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
	} satisfies UserEventSellerSchema.Type["rejected"];
};

/**
 * Computes seller resolve metrics.
 *
 * @note Tracks whether sellers actively resolve transactions (success/close) or if buyers ended
 *          the transaction before sellers could resolve.
 * @note This is a positive metric telling if the seller comes back after the transaction to mark
 *          it as "success/closed".
 *
 * Flow tracked:
 * 1. transaction.create (foreign scope) - counts total (buyer creates transaction, records createAtMs)
 * 2a. If transaction.closed/rejected (foreign scope) -> terminal (buyer ended, seller had no choice)
 * 2b. If transaction.rejected (user scope) -> terminal (seller rejected, not resolved)
 * 2c. If transaction.success/closed (user scope) -> resolved (seller made explicit resolution, records delta from create)
 */
export const computeSellerResolved = (source: UserEventTableSchema.Type[]) => {
	let total = 0;
	let resolved = 0;
	let terminal = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false;
	let createAtMs: number | null = null;
	let done = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		createAtMs = null;
		done = false;
	};

	const isBuyerTerminal = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success") &&
		event.scope === "foreign";

	const isSellerTerminal = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.rejected" && event.scope === "user";

	const isSellerResolve = (event: UserEventTableSchema.Type) =>
		event.scope === "user" && event.event === "transaction.resolved";

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all transactions created by buyers (foreign scope)
		if (event.event === "transaction.create" && event.scope === "foreign") {
			if (!created) {
				created = true;
				total++;
				createAtMs = createdAt;
			}
			continue;
		}

		if (!created || done) {
			continue;
		}

		// buyer ended it -> seller had no choice
		if (isBuyerTerminal(event)) {
			if (createAtMs != null && createdAt >= createAtMs) {
				terminal++;
				done = true;
			}
			continue;
		}

		// seller rejected it -> terminal (not resolved)
		if (isSellerTerminal(event)) {
			if (createAtMs != null && createdAt >= createAtMs) {
				terminal++;
				done = true;
			}
			continue;
		}

		// seller explicit resolved
		if (isSellerResolve(event)) {
			if (createAtMs == null) {
				continue;
			}
			if (createdAt < createAtMs) {
				continue;
			}

			resolved++;
			deltasMs.push(createdAt - createAtMs);
			done = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		resolved,
		terminal,
		percent: total === 0 ? 0 : (resolved / total) * 100,
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
	} satisfies UserEventSellerSchema.Type["resolved"];
};

/**
 * Computes expired/ghosted transaction metrics.
 *
 * @note Tracks transactions where buyers reached out (created transactions) but sellers
 *          never responded, causing them to expire or be resolved without seller action.
 * @note This is a negative metric telling if the seller is used to expire transactions
 *          (no user's messages).
 *
 * Flow tracked:
 * 1. transaction.create (foreign scope) - counts total (buyer creates transaction)
 * 2. transaction.create sets pingAtMs (buyer "ping" moment)
 * 3. transaction.message (foreign scope) - resets pingAtMs (buyer nudged)
 * 4a. If transaction.message/open/closed/rejected/success (user scope) after ping -> disqualifies from expired
 * 4b. If transaction.expired/resolved (foreign scope) after ping without seller action -> expired
 */
export const computeSellerExpired = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (foreign)
	let expired = 0; // transaction.expired OR transaction.resolved (foreign) without seller action after buyer ping
	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let pingAtMs: number | null = null; // buyer "ping" moment: create OR last foreign message
	let done = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		pingAtMs = null;
		done = false;
	};

	const isBuyerCreate = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.create" && event.scope === "foreign";

	const isBuyerMessage = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.message" && event.scope === "foreign";

	const isBuyerEnd = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.expired" || event.event === "transaction.resolved") &&
		event.scope === "foreign";

	// seller "did something" after ping -> not ghost
	const isSellerAction = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.open" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all transactions created by buyers (foreign scope) per group
		if (isBuyerCreate(event)) {
			if (!created) {
				created = true;
				total++;
			}
			if (pingAtMs === null) {
				pingAtMs = createdAt;
			}
			continue;
		}

		if (!created || done) {
			continue;
		}

		if (pingAtMs != null && isBuyerMessage(event)) {
			// buyer nudged -> reset ping moment
			pingAtMs = createdAt;
			continue;
		}

		// seller acted after ping -> disqualify
		if (pingAtMs != null && isSellerAction(event)) {
			if (createdAt >= pingAtMs) {
				done = true;
			}
			continue;
		}

		// buyer ended as expired/resolved -> count only if we had a ping and seller didn't act after it
		if (pingAtMs != null && isBuyerEnd(event)) {
			expired++;
			done = true;
		}
	}

	return {
		total,
		expired,
		percent: total === 0 ? 0 : (expired / total) * 100,
	} satisfies UserEventSellerSchema.Type["expired"];
};

export const computeSellerScore = (input: {
	reaction: UserEventSellerSchema.Type["reaction"];
	resolved: UserEventSellerSchema.Type["resolved"];
	rejected: UserEventSellerSchema.Type["rejected"];
	expired: UserEventSellerSchema.Type["expired"];
	activity: UserEventSellerSchema.Type["activity"];
	load: UserEventSellerSchema.Type["load"];
}) => {
	const { reaction, resolved, rejected, expired, activity, load } = input;

	const bonusActivity = (bucket: ActivityEnumSchema.Type) =>
		bucket === "high" ? 2 : bucket === "medium" ? 1 : 0;

	const bonusLoad = (bucket: LoadEnumSchema.Type) =>
		bucket === "low" ? 2 : bucket === "medium" ? 1 : 0;

	const bonusReactionSpeed = (reaction: { reactions: number; medianMs: number }) => {
		// bonus only if we actually have reaction samples
		if (reaction.reactions <= 0) {
			return 0;
		}

		const h1 = 1 * 60 * 60 * 1000;
		const h4 = 4 * 60 * 60 * 1000;
		const h8 = 8 * 60 * 60 * 1000;

		if (reaction.medianMs <= h1) {
			return 6;
		}
		if (reaction.medianMs <= h4) {
			return 4;
		}
		if (reaction.medianMs <= h8) {
			return 2;
		}

		return 0;
	};

	// positives
	const resolvePoints = clamp(resolved.percent, 0, 100) * 0.55; // 0..55
	const reactionPoints = clamp(reaction.percent, 0, 100) * 0.25; // 0..25

	const rejectedOver = Math.max(0, rejected.percent - 10); // allow up to 10%
	const rejectedPenalty = clamp(rejectedOver, 0, 100) * 0.25; // 0..25

	const expiredOver = Math.max(0, expired.percent - 10); // allow up to 10%
	const expiredPenalty = clamp(expiredOver, 0, 100) * 0.1; // 0..10

	// micro context
	const micro = bonusActivity(activity.bucket) + bonusLoad(load.bucket); // 0..4

	// speed bonus
	const speed = bonusReactionSpeed(reaction); // 0..6

	const raw = resolvePoints + reactionPoints + micro + speed - rejectedPenalty - expiredPenalty;
	const score = clamp(Math.round(raw), 0, 100);

	return {
		score,
		rank:
			score >= 85
				? 6
				: score >= 70
					? 5
					: score >= 55
						? 4
						: score >= 40
							? 3
							: score >= 25
								? 2
								: 1,
	} satisfies UserEventSellerSchema.Type["score"];
};

export const userEventSellerInfoFx = Effect.fn("userEventSellerInfoFx")(function* ({
	userId,
}: userEventSellerInfoFx.Props) {
	const logger = yield* getLoggerFx("userEventSellerInfoFx");
	logger.trace("userEventSellerInfoFx", {
		userId,
	});

	const cutoff = 90;

	const source = yield* userEventCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
		where: {
			cutoff,
		},
		scope: {
			userId,
		},
		sort: [
			{
				field: "group",
				order: "asc",
			},
			{
				field: "createdAt",
				order: "asc",
			},
			{
				field: "id",
				order: "asc",
			},
		],
	});

	if (source.length <= 1) {
		return null;
	}

	const result: Omit<UserEventSellerSchema.Type, "score"> = {
		reaction: computeSellerReaction(source),
		rejected: computeSellerRejected(source),
		resolved: computeSellerResolved(source),
		expired: computeSellerExpired(source),
		load: computeLoad({
			source,
			createScope: "foreign",
		}),
		activity: yield* computeActivityFx({
			source,
			days: cutoff,
		}),
	};

	return {
		...result,
		score: computeSellerScore(result),
	} satisfies UserEventSellerSchema.Type;
});
