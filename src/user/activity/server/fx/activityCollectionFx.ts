import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";
import { withActivitySelectFx } from "../db/withActivitySelectFx";
import type { ActivityWhereSchema } from "../schema/ActivityWhereSchema";

export namespace activityCollectionFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityWhereSchema.Type;
	}
}

export const activityCollectionFx = Effect.fn("activityCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 30,
	},
	limit,
	where,
	scope,
	sort,
}: activityCollectionFx.Props) {
	const logger = yield* getLoggerFx("activityCollectionFx");
	logger.trace("activityCollectionFx", {
		cursor,
		limit,
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
		where,
		scope,
	});
});

export type activityCollectionFx = ReturnType<typeof activityCollectionFx>;
