/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */

import { clamp } from "@use-pico/common/clamp";
import { median } from "@use-pico/common/median";
import { p90 } from "@use-pico/common/p90";
import { Effect } from "effect";
import { userEventCollectionFx } from "~/@user/user-event/fx/userEventCollectionFx";
import type { UserEventSellerSchema } from "~/@user/user-event/schema/UserEventSellerSchema";
import type { UserEventDbSchema } from "~/app/user-event/schema/UserEventDbSchema";

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
const computeReaction = (source: UserEventDbSchema.Type[]) => {
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

	const isBuyerTerminal = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isSellerReaction = (event: UserEventDbSchema.Type) =>
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
const computeRejected = (source: UserEventDbSchema.Type[]) => {
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

	const isSellerRejected = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.rejected" && event.scope === "user";

	const isInteraction = (event: UserEventDbSchema.Type) =>
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
const computeResolved = (source: UserEventDbSchema.Type[]) => {
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

	const isBuyerTerminal = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success") &&
		event.scope === "foreign";

	const isSellerTerminal = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.rejected" && event.scope === "user";

	const isSellerResolve = (event: UserEventDbSchema.Type) =>
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
const computeExpired = (source: UserEventDbSchema.Type[]) => {
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

	const isBuyerCreate = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.create" && event.scope === "foreign";

	const isBuyerMessage = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.message" && event.scope === "foreign";

	const isBuyerEnd = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.expired" || event.event === "transaction.resolved") &&
		event.scope === "foreign";

	// seller "did something" after ping -> not ghost
	const isSellerAction = (event: UserEventDbSchema.Type) =>
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

const computeLoad = (
	source: UserEventDbSchema.Type[],
	thresholds = {
		lowMax: 1,
		mediumMax: 3,
	},
) => {
	// count of "active" opened transactions (create+open, no end)
	let count = 0;

	let currentGroup: string | null = null;

	let created = false;
	let ended = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		ended = false;
	};

	const isEnd = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.success" ||
		event.event === "transaction.closed" ||
		event.event === "transaction.rejected" ||
		event.event === "transaction.expired" ||
		event.event === "transaction.resolved";

	const finishGroup = () => {
		if (created && !ended) {
			count++;
		}
	};

	for (const event of source) {
		if (currentGroup !== event.group) {
			// finish previous group before switching
			if (currentGroup !== null) {
				finishGroup();
			}
			flushGroup();
			currentGroup = event.group;
		}

		if (event.event === "transaction.create" && event.scope === "foreign") {
			created = true;
			continue;
		}

		if (isEnd(event)) {
			ended = true;
		}
	}

	// finish last group
	if (currentGroup !== null) {
		finishGroup();
	}

	const bucket =
		count <= thresholds.lowMax ? "low" : count <= thresholds.mediumMax ? "medium" : "high";

	return {
		bucket,
	} satisfies UserEventSellerSchema.Type["load"];
};

const computeActivity = (source: UserEventDbSchema.Type[], days: number) => {
	let lastUserAtMs: number | null = null;

	for (const event of source) {
		if (event.scope !== "user") continue;

		const t = event.createdAt.getTime();
		if (lastUserAtMs === null || t > lastUserAtMs) {
			lastUserAtMs = t;
		}
	}

	// "none" -> low
	if (lastUserAtMs === null) {
		return {
			bucket: "low",
		} satisfies UserEventSellerSchema.Type["activity"];
	}

	const nowMs = Date.now();
	const ageMs = Math.max(0, nowMs - lastUserAtMs);
	const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

	// split [0..days) into 3 buckets
	const tier = Math.max(1, Math.floor(days / 3));

	const bucket = ageDays < tier ? "high" : ageDays < tier * 2 ? "medium" : "low";

	return {
		bucket,
	} satisfies UserEventSellerSchema.Type["activity"];
};

export const computeScore = (input: {
	reaction: UserEventSellerSchema.Type["reaction"];
	resolved: UserEventSellerSchema.Type["resolved"];
	rejected: UserEventSellerSchema.Type["rejected"];
	expired: UserEventSellerSchema.Type["expired"];
	activity: UserEventSellerSchema.Type["activity"];
	load: UserEventSellerSchema.Type["load"];
}) => {
	const { reaction, resolved, rejected, expired, activity, load } = input;

	const bonusActivity = (bucket: "low" | "medium" | "high") =>
		bucket === "high" ? 2 : bucket === "medium" ? 1 : 0;

	const bonusLoad = (bucket: "low" | "medium" | "high") =>
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

export const userEventSellerInfoFx = ({ userId }: userEventSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		const cutoff = 90;

		const { data: source } = yield* userEventCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				cutoff,
				userId,
			},
			sort: [
				{
					field: "group",
					direction: "asc",
				},
				{
					field: "createdAt",
					direction: "asc",
				},
				{
					field: "id",
					direction: "asc",
				},
			],
		});

		if (source.length <= 1) {
			return null;
		}

		const result: Omit<UserEventSellerSchema.Type, "score"> = {
			reaction: computeReaction(source),
			rejected: computeRejected(source),
			resolved: computeResolved(source),
			expired: computeExpired(source),
			load: computeLoad(source),
			activity: computeActivity(source, cutoff),
		};

		return {
			...result,
			score: computeScore(result),
		} satisfies UserEventSellerSchema.Type;
	});
};
