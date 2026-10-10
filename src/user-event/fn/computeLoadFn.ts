import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";
import type { LoadEnumSchema } from "~/user-event/schema/LoadEnumSchema";
import type { UserEventScopeEnumSchema } from "~/user-event-contract/schema/UserEventScopeEnumSchema";

export namespace computeLoadFn {
	export interface Thresholds {
		lowMax: number;
		mediumMax: number;
	}

	export interface Props {
		source: UserEventTableSchema.Type[];
		createScope: UserEventScopeEnumSchema.Type;
		thresholds?: Thresholds;
	}

	export interface Result {
		bucket: LoadEnumSchema.Type;
	}
}

/**
 * Counts "active" opened transactions per group (transaction.create in given scope, no terminal event),
 * then buckets the count into low/medium/high.
 *
 * @param createScope - Which scope's transaction.create counts as "created" (user = buyer-created, foreign = seller-view of buyer-created).
 */
export const computeLoadFn = ({
	source,
	createScope,
	thresholds = {
		lowMax: 1,
		mediumMax: 3,
	},
}: computeLoadFn.Props): computeLoadFn.Result => {
	let count = 0;

	let currentGroup: string | null = null;

	let created = false;
	let ended = false;

	const flushGroupFn = () => {
		currentGroup = null;

		created = false;
		ended = false;
	};

	const isEndFn = (event: UserEventTableSchema.Type) =>
		event.event === "transaction.success" ||
		event.event === "transaction.closed" ||
		event.event === "transaction.rejected" ||
		event.event === "transaction.expired" ||
		event.event === "transaction.resolved";

	const finishGroupFn = () => {
		if (created && !ended) {
			count++;
		}
	};

	for (const event of source) {
		if (currentGroup !== event.group) {
			if (currentGroup !== null) {
				finishGroupFn();
			}
			flushGroupFn();
			currentGroup = event.group;
		}

		if (event.event === "transaction.create" && event.scope === createScope) {
			created = true;
			continue;
		}

		if (isEndFn(event)) {
			ended = true;
		}
	}

	if (currentGroup !== null) {
		finishGroupFn();
	}

	const bucket: LoadEnumSchema.Type =
		count <= thresholds.lowMax ? "low" : count <= thresholds.mediumMax ? "medium" : "high";

	return {
		bucket,
	};
};
