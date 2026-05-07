import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export namespace activityFetchFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityFetchFx = Effect.fn("activityFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: activityFetchFx.Props) {
	const logger = yield* getLoggerFx("activityFetchFx");
	logger.trace("activityFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "activity",
		selectFx: withActivitySelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type activityFetchFx = ReturnType<typeof activityFetchFx>;
