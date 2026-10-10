import { Effect } from "effect";
import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { clampFn } from "~/number/fn/clampFn";
import { medianFn } from "~/number/fn/medianFn";
import { p90Fn } from "~/number/fn/p90Fn";
import type { UserEventBuyerSchema } from "~/seller-user-event/schema/UserEventBuyerSchema";
import { computeLoadFn } from "~/user-event/fn/computeLoadFn";
import { computeActivityFx } from "~/user-event/fx/computeActivityFx";
import { userEventCollectionFx } from "~/user-event/fx/userEventCollectionFx";
import type { ActivityEnumSchema } from "~/user-event/schema/ActivityEnumSchema";
import type { LoadEnumSchema } from "~/user-event/schema/LoadEnumSchema";

export namespace userEventBuyerInfoFx {
	export interface Props {
		userId: string;
	}
}

/**
 * Computes buyer reaction metrics.
 *
 * @note Tracks how quickly buyers respond when sellers open transactions, and whether they
 *          react at all before the seller closes/rejects (terminal).
 * @note This is a soft metric used to tell seller if buyer reacts and how long
 *          it usually takes.
 *
 * Flow tracked:
 * 1. transaction.create (user scope) - counts total
 * 2. transaction.open (foreign scope) - starts reaction window (records openAtMs)
 * 3a. If transaction.closed/rejected (foreign scope) before buyer reacts -> terminal
 * 3b. If transaction.message/closed/rejected (user scope) after open -> reaction (records delta from open)
 */
export const computeBuyerReactionFn = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let reactions = 0;
	let terminal = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let openAtMs: number | null = null;
	let done = false; // group resolved (reacted or terminal)

	const flushGroupFn = () => {
		currentGroup = null;

		created = false;
		openAtMs = null;
		done = false;
	};

	const isSellerTerminalFn = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isBuyerReactionFn = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroupFn();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all created transactions (by buyer) per group
		if (event.event === "transaction.create" && event.scope === "user") {
			if (!created) {
				created = true;
				total++;
			}
			continue;
		}

		if (!created || done) continue;

		// reaction window starts at open (seller opens)
		if (event.event === "transaction.open" && event.scope === "foreign") {
			if (openAtMs === null) {
				openAtMs = createdAt;
			}
			continue;
		}

		// seller ended before buyer could react
		if (isSellerTerminalFn(event)) {
			terminal++;
			done = true;
			continue;
		}

		// first buyer reaction after open => reacted (message OR close/reject)
		if (isBuyerReactionFn(event)) {
			if (openAtMs == null) continue;
			if (createdAt < openAtMs) continue;

			reactions++;
			deltasMs.push(createdAt - openAtMs);
			done = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		reactions,
		terminal,
		percent: total === 0 ? 0 : ((reactions + terminal) / total) * 100,
		medianMs: medianFn(deltasMs),
		p90Ms: p90Fn(deltasMs),
	} satisfies UserEventBuyerSchema.Type["reaction"];
};

/**
 * Computes buyer closer metrics (transactions closed without interaction).
 *
 * @note Tracks transactions where buyers close them directly without any back-and-forth
 *          interaction (messages, negotiations, etc.).
 * @note This is a hard metric telling the seller, how often buyer closes the
 *          transaction without _any_ interaction.
 *
 * Flow tracked:
 * 1. transaction.create (user scope) - counts total (records createAtMs)
 * 2. transaction.open (foreign scope) - allowed between create and end (doesn't mark as dirty)
 * 3. Any other event between create and end (including messages) -> marks as dirty
 * 4. transaction.closed/rejected/success (user scope) - if not dirty, counts as closed (records delta from create)
 */
export const computeBuyerCloserFn = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let closed = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let createAtMs: number | null = null;

	let dirty = false;
	let done = false;

	const flushGroupFn = () => {
		currentGroup = null;

		created = false;
		createAtMs = null;

		dirty = false;
		done = false;
	};

	const isAllowedBetweenFn = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.open" && event.scope === "foreign";

	const isEndFn = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroupFn();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		if (event.event === "transaction.create" && event.scope === "user") {
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

		if (isEndFn(event)) {
			done = true;

			if (!dirty) {
				closed++;
				deltasMs.push(createdAt - createAtMs);
			}
			continue;
		}

		// anything else between create and end makes it dirty (messages included)
		if (!isAllowedBetweenFn(event)) {
			dirty = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		closed,
		percent: total === 0 ? 0 : (closed / total) * 100,
		medianMs: medianFn(deltasMs),
		p90Ms: p90Fn(deltasMs),
	} satisfies UserEventBuyerSchema.Type["closer"];
};

/**
 * Computes buyer decision metrics.
 *
 * @note Tracks whether buyers actively made decisions (success/close) or if sellers ended
 *          the transaction before buyers could decide.
 * @note This is a positive metric telling if the buyer comes back after the transaction to mark
 *          it as "success/closed".
 *
 * Flow tracked:
 * 1. transaction.create (user scope) - counts total
 * 2a. If transaction.closed/rejected (foreign scope) -> terminal (seller ended, buyer had no choice)
 * 2b. If transaction.success/closed (user scope) -> decision (buyer made explicit decision)
 */
export const computeBuyerDecisionFn = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let decisions = 0;
	let terminal = 0;

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let done = false; // group resolved (decision OR terminal)

	const flushGroupFn = () => {
		currentGroup = null;

		created = false;
		done = false;
	};

	const isSellerTerminalFn = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isBuyerDecisionFn = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.success" || event.event === "transaction.closed");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroupFn();
			currentGroup = event.group;
		}

		// denominator: all created transactions (by buyer)
		if (event.event === "transaction.create" && event.scope === "user") {
			if (!created) {
				created = true;
				total++;
			}
			continue;
		}

		if (!created || done) {
			continue;
		}

		// seller ended it -> buyer had no choice
		if (isSellerTerminalFn(event)) {
			terminal++;
			done = true;
			continue;
		}

		// buyer explicit decision
		if (isBuyerDecisionFn(event)) {
			decisions++;
			done = true;
		}
	}

	return {
		total,
		decisions,
		terminal,
		percent: total === 0 ? 0 : ((decisions + terminal) / total) * 100,
	} satisfies UserEventBuyerSchema.Type["decision"];
};

/**
 * Computes expired/ghosted transaction metrics.
 *
 * @note Tracks transactions where sellers reached out (opened or sent messages) but buyers
 *          never responded, causing them to expire or be resolved without buyer action.
 * @note This is a negative metric telling if the buyer is used to expire transactions
 *          (no user's messages).
 *
 * Flow tracked:
 * 1. transaction.create (user scope) - counts total
 * 2. transaction.open (foreign scope) - sets pingAtMs (seller "ping" moment)
 * 3. transaction.message (foreign scope) - resets pingAtMs (seller nudged)
 * 4a. If transaction.message/closed/rejected/success (user scope) after ping -> disqualifies from expired
 * 4b. If transaction.expired/resolved (foreign scope) after ping without buyer action -> expired
 */
export const computeBuyerExpiredFn = (source: UserEventTableSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let expired = 0; // transaction.expired OR transaction.resolved (foreign) without buyer action after seller ping
	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let pingAtMs: number | null = null; // seller "ping" moment: open OR last foreign message
	let done = false;

	const flushGroupFn = () => {
		currentGroup = null;

		created = false;
		pingAtMs = null;
		done = false;
	};

	const isSellerOpenFn = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.open" && event.scope === "foreign";

	const isSellerMessageFn = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.message" && event.scope === "foreign";

	const isSellerEndFn = (event: UserEventTableSchema.Type) =>
		(event.event === "transaction.expired" || event.event === "transaction.resolved") &&
		event.scope === "foreign";

	// buyer "did something" after ping -> not ghost
	const isBuyerActionFn = (event: UserEventTableSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroupFn();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all created transactions (by buyer) per group
		if (event.event === "transaction.create" && event.scope === "user") {
			if (!created) {
				created = true;
				total++;
			}
			continue;
		}

		if (!created || done) {
			continue;
		}

		// seller "ping" starts (or updates) the expectation window
		if (isSellerOpenFn(event)) {
			if (pingAtMs === null) {
				pingAtMs = createdAt;
			}
			continue;
		}

		if (pingAtMs != null && isSellerMessageFn(event)) {
			// seller nudged -> reset ping moment
			pingAtMs = createdAt;
			continue;
		}

		// buyer acted after ping -> disqualify
		if (pingAtMs != null && isBuyerActionFn(event)) {
			if (createdAt >= pingAtMs) {
				done = true;
			}
			continue;
		}

		// seller ended as expired/resolved -> count only if we had a ping and buyer didn't act after it
		if (pingAtMs != null && isSellerEndFn(event)) {
			expired++;
			done = true;
		}
	}

	return {
		total,
		expired,
		percent: total === 0 ? 0 : (expired / total) * 100,
	} satisfies UserEventBuyerSchema.Type["expired"];
};

export const computeBuyerScoreFn = (input: {
	reaction: UserEventBuyerSchema.Type["reaction"];
	decision: UserEventBuyerSchema.Type["decision"];
	closer: UserEventBuyerSchema.Type["closer"];
	expired: UserEventBuyerSchema.Type["expired"];
	activity: UserEventBuyerSchema.Type["activity"];
	load: UserEventBuyerSchema.Type["load"];
}) => {
	const { reaction, decision, closer, expired, activity, load } = input;

	const bonusActivityFn = (bucket: ActivityEnumSchema.Type) =>
		bucket === "high" ? 2 : bucket === "medium" ? 1 : 0;

	const bonusLoadFn = (bucket: LoadEnumSchema.Type) =>
		bucket === "low" ? 2 : bucket === "medium" ? 1 : 0;

	const bonusReactionSpeedFn = (reaction: { reactions: number; medianMs: number }) => {
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
	const decisionPoints = clampFn(decision.percent, 0, 100) * 0.55; // 0..55
	const reactionPoints = clampFn(reaction.percent, 0, 100) * 0.25; // 0..25

	const closerOver = Math.max(0, closer.percent - 10); // allow up to 10%
	const closerPenalty = clampFn(closerOver, 0, 100) * 0.25; // 0..25

	const expiredOver = Math.max(0, expired.percent - 10); // allow up to 10%
	const expiredPenalty = clampFn(expiredOver, 0, 100) * 0.1; // 0..10

	// micro context
	const micro = bonusActivityFn(activity.bucket) + bonusLoadFn(load.bucket); // 0..4

	// speed bonus
	const speed = bonusReactionSpeedFn(reaction); // 0..6

	const raw = decisionPoints + reactionPoints + micro + speed - closerPenalty - expiredPenalty;
	const score = clampFn(Math.round(raw), 0, 100);

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
	} satisfies UserEventBuyerSchema.Type["score"];
};

export const userEventBuyerInfoFx = Effect.fn("userEventBuyerInfoFx")(function* ({
	userId,
}: userEventBuyerInfoFx.Props) {
	const logger = yield* getLoggerFx("userEventBuyerInfoFx");
	logger.trace("userEventBuyerInfoFx", {
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

	const result: Omit<UserEventBuyerSchema.Type, "score"> = {
		reaction: computeBuyerReactionFn(source),
		closer: computeBuyerCloserFn(source),
		decision: computeBuyerDecisionFn(source),
		expired: computeBuyerExpiredFn(source),
		load: computeLoadFn({
			source,
			createScope: "user",
		}),
		activity: yield* computeActivityFx({
			source,
			days: cutoff,
		}),
	};

	return {
		...result,
		score: computeBuyerScoreFn(result),
	} satisfies UserEventBuyerSchema.Type;
});
