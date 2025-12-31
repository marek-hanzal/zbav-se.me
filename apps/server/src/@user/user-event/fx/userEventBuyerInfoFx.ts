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

		if (createAtMs == null) continue;
		if (createdAt < createAtMs) continue;
		if (done) continue;

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
		} satisfies UserEventBuyerSchema.Type;
	});
};
