import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withActivitySelectFx } from "~/user-activity/db/withActivitySelectFx";
import type { ActivityQuerySchema } from "~/user-activity/schema/ActivityQuerySchema";
import type { ActivityWhereSchema } from "~/user-activity/schema/ActivityWhereSchema";

export namespace activityFetchFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityWhereSchema.Type;
	}
}

export const activityFetchFx = Effect.fn("activityFetchFx")(function* ({
	where,
	scope,
	sort,
}: activityFetchFx.Props) {
	const logger = yield* getLoggerFx("activityFetchFx");
	logger.trace("activityFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "activity",
		selectFx: withActivitySelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type activityFetchFx = ReturnType<typeof activityFetchFx>;
