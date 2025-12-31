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
	let total = 0;
	let reactions = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;
	let openAtMs: number | null = null;
	let reacted = false;

	const flushGroup = () => {
		currentGroup = null;
		openAtMs = null;
		reacted = false;
	};

	for (const event of source) {
		if (currentGroup !== event.group) {
			flushGroup();
			currentGroup = event.group;
		}

		const createdAt = event.createdAt.getTime();

		if (event.event === "transaction.open" && event.scope === "foreign") {
			if (openAtMs === null) {
				openAtMs = createdAt;
				total++;
			}
			continue;
		}

		if (event.event === "transaction.message" && event.scope === "user") {
			if (openAtMs == null) {
				continue;
			}
			if (reacted) {
				continue;
			}
			if (createdAt < openAtMs) {
				continue;
			}

			reacted = true;
			reactions++;
			deltasMs.push(createdAt - openAtMs);
		}
	}

	deltasMs.sort((a, b) => a - b);

	return {
		total,
		reactions,
		medianMs: median(deltasMs),
		p90Ms: p90(deltasMs),
	};
};

const computeCloser = (source: UserEventDbSchema.Type[]) => {
	let total = 0;
	let closed = 0;
	const deltasMs: number[] = [];

	let currentGroup: string | null = null;

	let createAtMs: number | null = null;
	let dirty = false;
	let done = false;

	const flushGroup = () => {
		currentGroup = null;
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

		const isAllowedBetween = event.event === "transaction.open" && event.scope === "foreign";

		const isEnd =
			(event.event === "transaction.closed" || event.event === "transaction.rejected") &&
			event.scope === "user";

		if (isEnd) {
			done = true;

			total++;

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
	};
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
