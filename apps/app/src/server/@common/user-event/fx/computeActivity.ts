import type { ActivityEnumSchema } from "~/server/@common/user-event/schema/ActivityEnumSchema";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";

/**
 * Finds the latest user-scoped event, computes age in days, and buckets into high/medium/low
 * (high = recent, low = old). Splits the window [0..days) into 3 equal tiers.
 */
export const computeActivity = (
	source: UserEventTableSchema.Type[],
	days: number,
): {
	bucket: ActivityEnumSchema.Type;
} => {
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
		};
	}

	const nowMs = Date.now();
	const ageMs = Math.max(0, nowMs - lastUserAtMs);
	const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

	const tier = Math.max(1, Math.floor(days / 3));

	const bucket: ActivityEnumSchema.Type =
		ageDays < tier ? "high" : ageDays < tier * 2 ? "medium" : "low";

	return {
		bucket,
	};
};
