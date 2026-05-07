import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ActivityCountQuerySchema } from "~/user/activity/server/schema/ActivityCountQuerySchema";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import { withActivitySelectFx } from "../db/withActivitySelectFx";

export namespace activityCountFx {
	export interface Props extends ActivityCountQuerySchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityCountFx = Effect.fn("activityCountFx")(function* ({
	filter,
	where,
	scope,
}: activityCountFx.Props) {
	const logger = yield* getLoggerFx("activityCountFx");
	logger.trace("activityCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withActivitySelectFx({}),
		filter,
		where,
		scope,
	});
});

export type activityCountFx = ReturnType<typeof activityCountFx>;
