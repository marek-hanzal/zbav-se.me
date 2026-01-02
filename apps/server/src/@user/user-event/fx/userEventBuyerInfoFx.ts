/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */

import { median } from "@use-pico/common/median";
import { p90 } from "@use-pico/common/p90";
import { Effect } from "effect";
import { userEventCollectionFx } from "~/@user/user-event/fx/userEventCollectionFx";
import type { UserEventBuyerSchema } from "~/@user/user-event/schema/UserEventBuyerSchema";
import type { UserEventDbSchema } from "~/app/user-event/schema/UserEventDbSchema";

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
const computeReaction = (source: UserEventDbSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let reactions = 0;
	let terminal = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let openAtMs: number | null = null;
	let done = false; // group resolved (reacted or terminal)

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		openAtMs = null;
		done = false;
	};

	const isSellerTerminal = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isBuyerReaction = (event: UserEventDbSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
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
		if (isSellerTerminal(event)) {
			terminal++;
			done = true;
			continue;
		}

		// first buyer reaction after open => reacted (message OR close/reject)
		if (isBuyerReaction(event)) {
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
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
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
const computeCloser = (source: UserEventDbSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let closed = 0;
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

	const isAllowedBetween = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.open" && event.scope === "foreign";

	const isEnd = (event: UserEventDbSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
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

		if (isEnd(event)) {
			done = true;

			if (!dirty) {
				closed++;
				deltasMs.push(createdAt - createAtMs);
			}
			continue;
		}

		// anything else between create and end makes it dirty (messages included)
		if (!isAllowedBetween(event)) {
			dirty = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		closed,
		percent: total === 0 ? 0 : (closed / total) * 100,
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
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
const computeDecision = (source: UserEventDbSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let decisions = 0;
	let terminal = 0;

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let done = false; // group resolved (decision OR terminal)

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		done = false;
	};

	const isSellerTerminal = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
		event.scope === "foreign";

	const isBuyerDecision = (event: UserEventDbSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.success" || event.event === "transaction.closed");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
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
		if (isSellerTerminal(event)) {
			terminal++;
			done = true;
			continue;
		}

		// buyer explicit decision
		if (isBuyerDecision(event)) {
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
const computeExpired = (source: UserEventDbSchema.Type[]) => {
	let total = 0; // transaction.create (user)
	let expired = 0; // transaction.expired OR transaction.resolved (foreign) without buyer action after seller ping
	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let pingAtMs: number | null = null; // seller "ping" moment: open OR last foreign message
	let done = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		pingAtMs = null;
		done = false;
	};

	const isSellerOpen = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.open" && event.scope === "foreign";

	const isSellerMessage = (event: UserEventDbSchema.Type) =>
		event.event === "transaction.message" && event.scope === "foreign";

	const isSellerEnd = (event: UserEventDbSchema.Type) =>
		(event.event === "transaction.expired" || event.event === "transaction.resolved") &&
		event.scope === "foreign";

	// buyer "did something" after ping -> not ghost
	const isBuyerAction = (event: UserEventDbSchema.Type) =>
		event.scope === "user" &&
		(event.event === "transaction.message" ||
			event.event === "transaction.closed" ||
			event.event === "transaction.rejected" ||
			event.event === "transaction.success");

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
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
		if (isSellerOpen(event)) {
			if (pingAtMs === null) {
				pingAtMs = createdAt;
			}
			continue;
		}

		if (pingAtMs != null && isSellerMessage(event)) {
			// seller nudged -> reset ping moment
			pingAtMs = createdAt;
			continue;
		}

		// buyer acted after ping -> disqualify
		if (pingAtMs != null && isBuyerAction(event)) {
			if (createdAt >= pingAtMs) {
				done = true;
			}
			continue;
		}

		// seller ended as expired/resolved -> count only if we had a ping and buyer didn't act after it
		if (pingAtMs != null && isSellerEnd(event)) {
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

export const userEventBuyerInfoFx = ({ userId }: userEventBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		const { data: source } = yield* userEventCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				cutoff: 90,
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

		return {
			reaction: computeReaction(source),
			closer: computeCloser(source),
			decision: computeDecision(source),
			expired: computeExpired(source),
		} satisfies UserEventBuyerSchema.Type;
	});
};
