import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";
import { withActivitySelectFx } from "../db/withActivitySelectFx";

export namespace activityCollectionFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityCollectionFx = Effect.fn("activityCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 30,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: activityCollectionFx.Props) {
	const logger = yield* getLoggerFx("activityCollectionFx");
	logger.trace("activityCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withActivitySelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type activityCollectionFx = ReturnType<typeof activityCollectionFx>;
