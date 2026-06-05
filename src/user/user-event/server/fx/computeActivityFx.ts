import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";
import type { ActivityEnumSchema } from "../schema/ActivityEnumSchema";

/**
 * Finds the latest user-scoped event, computes age in days, and buckets into high/medium/low
 * (high = recent, low = old). Splits the window [0..days) into 3 equal tiers.
 */
export namespace computeActivityFx {
	export interface Props {
		source: UserEventTableSchema.Type[];
		days: number;
	}

	export interface Result {
		bucket: ActivityEnumSchema.Type;
	}
}

export const computeActivityFx = ({
	source,
	days,
}: computeActivityFx.Props): Effect.Effect<computeActivityFx.Result, never, DateServiceFx> =>
	Effect.gen(function* () {
		const dateContext = yield* DateServiceFx;

		let lastUserAtMs: number | null = null;

		for (const event of source) {
			if (event.scope !== "user") continue;

			const t = event.createdAt.getTime();
			if (lastUserAtMs === null || t > lastUserAtMs) {
				lastUserAtMs = t;
			}
		}

		if (lastUserAtMs === null) {
			return {
				bucket: "low",
			} satisfies computeActivityFx.Result;
		}

		const nowMs = dateContext.now().toMillis();
		const ageMs = Math.max(0, nowMs - lastUserAtMs);
		const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

		const tier = Math.max(1, Math.floor(days / 3));

		const bucket: ActivityEnumSchema.Type =
			ageDays < tier ? "high" : ageDays < tier * 2 ? "medium" : "low";

		return {
			bucket,
		} satisfies computeActivityFx.Result;
	});
