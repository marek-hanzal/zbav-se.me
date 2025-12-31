/** biome-ignore-all lint/style/noNonNullAssertion: Ssst */
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
			reaction: {
				total,
				reactions,
				medianMs: (() => {
					const n = deltasMs.length;
					if (n === 0) {
						return 0;
					}
					const mid = Math.floor(n / 2);
					return n % 2 === 1
						? deltasMs[mid]!
						: Math.round((deltasMs[mid - 1]! + deltasMs[mid]!) / 2);
				})(),
				p90Ms: (() => {
					const n = deltasMs.length;
					if (n === 0) {
						return 0;
					}
					const idx = Math.min(n - 1, Math.max(0, Math.ceil(n * 0.9) - 1));
					return deltasMs[idx]!;
				})(),
			},
		} satisfies UserEventBuyerSchema.Type;
	});
};
