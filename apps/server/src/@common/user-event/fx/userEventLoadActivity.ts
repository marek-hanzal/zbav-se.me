import type { UserEventTableSchema } from "~/database/@table/UserEventTableSchema";

export type LoadActivityBucket = "low" | "medium" | "high";

const LOAD_THRESHOLDS_DEFAULT = {
	lowMax: 1,
	mediumMax: 3,
} as const;

/**
 * Counts "active" opened transactions per group (transaction.create in given scope, no terminal event),
 * then buckets the count into low/medium/high.
 *
 * @param createScope - Which scope's transaction.create counts as "created" (user = buyer-created, foreign = seller-view of buyer-created).
 */
export const computeLoad = (
	source: UserEventTableSchema.Type[],
	createScope: "user" | "foreign",
	thresholds: { lowMax: number; mediumMax: number } = LOAD_THRESHOLDS_DEFAULT,
): { bucket: LoadActivityBucket } => {
	let count = 0;

	let currentGroup: string | null = null;

	let created = false;
	let ended = false;

	const flushGroup = () => {
		currentGroup = null;

		created = false;
		ended = false;
	};

	const isEnd = (event: UserEventTableSchema.Type) =>
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
			if (currentGroup !== null) {
				finishGroup();
			}
			flushGroup();
			currentGroup = event.group;
		}

		if (event.event === "transaction.create" && event.scope === createScope) {
			created = true;
			continue;
		}

		if (isEnd(event)) {
			ended = true;
		}
	}

	if (currentGroup !== null) {
		finishGroup();
	}

	const bucket =
		count <= thresholds.lowMax ? "low" : count <= thresholds.mediumMax ? "medium" : "high";

	return {
		bucket,
	};
};

/**
 * Finds the latest user-scoped event, computes age in days, and buckets into high/medium/low
 * (high = recent, low = old). Splits the window [0..days) into 3 equal tiers.
 */
export const computeActivity = (
	source: UserEventTableSchema.Type[],
	days: number,
): { bucket: LoadActivityBucket } => {
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

	const bucket = ageDays < tier ? "high" : ageDays < tier * 2 ? "medium" : "low";

	return {
		bucket,
	};
};
