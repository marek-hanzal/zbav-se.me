import type { LoadEnumSchema } from "~/@common/user-event/schema/LoadEnumSchema";
import type { UserEventTableSchema } from "~/database/@table/UserEventTableSchema";

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
	thresholds: {
		lowMax: number;
		mediumMax: number;
	} = LOAD_THRESHOLDS_DEFAULT,
): {
	bucket: LoadEnumSchema.Type;
} => {
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

	const bucket: LoadEnumSchema.Type =
		count <= thresholds.lowMax ? "low" : count <= thresholds.mediumMax ? "medium" : "high";

	return {
		bucket,
	};
};
