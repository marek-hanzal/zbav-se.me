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
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let created = false; // counted total for this group
	let openAtMs: number | null = null;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		openAtMs = null;
	};

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		// denominator: all created transactions (by user) per group
		if (event.event === "transaction.create" && event.scope === "user") {
			if (!created) {
				created = true;
				total++;
			}
			continue;
		}

		// reaction window starts at open (foreign)
		if (event.event === "transaction.open" && event.scope === "foreign") {
			if (openAtMs === null) {
				openAtMs = createdAt;
			}
			continue;
		}

		// first user message after open => reaction
		if (event.event === "transaction.message" && event.scope === "user") {
			if (openAtMs == null) {
				continue;
			}
			if (createdAt < openAtMs) {
				continue;
			}

			reactions++;
			deltasMs.push(createdAt - openAtMs);

			// lock: ensure max 1 reaction per group
			openAtMs = null;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		reactions,
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

		const isAllowedBetween = event.event === "transaction.open" && event.scope === "foreign";

		const isEnd =
			(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
			event.scope === "user";

		if (isEnd) {
			done = true;

			if (!dirty) {
				closed++;
				deltasMs.push(createdAt - createAtMs);
			}
			continue;
		}

		if (!isAllowedBetween) {
			dirty = true;
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		closed,
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
