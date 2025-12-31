/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */

import { median } from "@use-pico/common/median";
import { p90 } from "@use-pico/common/p90";
import { Effect } from "effect";
import { userEventCollectionFx } from "~/@user/user-event/fx/userEventCollectionFx";
import type { UserEventBuyerSchema } from "~/@user/user-event/schema/UserEventBuyerSchema";

export namespace userEventBuyerInfoFx {
	export interface Props {
		userId: string;
	}
}

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

		const response: UserEventBuyerSchema.Type = {
			reaction: {
				total: 0,
				reactions: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			closer: {
				total: 0,
				closed: 0,
				medianMs: 0,
				p90Ms: 0,
			},
		};

		const deltas = {
			reaction: [] as number[],
			closer: [] as number[],
		} as const;

		let currentGroup: string | null = null;

		// --- reaction state (open foreign -> first message user)
		let openAtMs: number | null = null;
		let reacted = false;

		// --- closer state (create user -> [optional open foreign] -> closed/rejected user; nothing else between)
		let createAtMs: number | null = null;
		let closerDirty = false;
		let closerDone = false;

		const flushGroup = () => {
			currentGroup = null;

			openAtMs = null;
			reacted = false;

			createAtMs = null;
			closerDirty = false;
			closerDone = false;
		};

		for (const event of source) {
			if (currentGroup !== event.group) {
				flushGroup();
				currentGroup = event.group;
			}

			const createdAt = event.createdAt.getTime();

			// --------------------
			// CLOSER (priority: set window as early as possible)
			// --------------------
			if (event.event === "transaction.create" && event.scope === "user") {
				if (createAtMs === null) {
					createAtMs = createdAt;
					response.closer.total++;
				}
				continue;
			}

			if (createAtMs != null && createdAt >= createAtMs && !closerDone) {
				const isAllowedBetween =
					event.event === "transaction.open" && event.scope === "foreign";

				const isCloserEnd =
					(event.event === "transaction.closed" ||
						event.event === "transaction.rejected") &&
					event.scope === "user";

				if (isCloserEnd) {
					closerDone = true;

					if (!closerDirty) {
						response.closer.closed++;
						deltas.closer.push(createdAt - createAtMs);
					}
					continue;
				}

				// anything else between create and end makes it dirty
				if (!isAllowedBetween) {
					closerDirty = true;
				}
			}

			// --------------------
			// REACTION
			// --------------------
			if (event.event === "transaction.open" && event.scope === "foreign") {
				if (openAtMs === null) {
					openAtMs = createdAt;
					response.reaction.total++;
				}
				continue;
			}

			if (event.event === "transaction.message" && event.scope === "user") {
				if (openAtMs == null) continue;
				if (reacted) continue;
				if (createdAt < openAtMs) continue;

				reacted = true;
				response.reaction.reactions++;
				deltas.reaction.push(createdAt - openAtMs);
			}
		}

		deltas.reaction.sort((a, b) => a - b);
		deltas.closer.sort((a, b) => a - b);

		response.reaction.medianMs = median(deltas.reaction);
		response.reaction.p90Ms = p90(deltas.reaction);

		response.closer.medianMs = median(deltas.closer);
		response.closer.p90Ms = p90(deltas.closer);

		return response;
	});
};
