import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ActivityCountQuerySchema } from "~/user/activity/server/schema/ActivityCountQuerySchema";
import { withActivitySelectFx } from "../db/withActivitySelectFx";
import type { ActivityWhereSchema } from "../schema/ActivityWhereSchema";

export namespace activityCountFx {
	export interface Props extends ActivityCountQuerySchema.Type {
		scope: ActivityWhereSchema.Type;
	}
}

export const activityCountFx = Effect.fn("activityCountFx")(function* ({
	where,
	scope,
}: activityCountFx.Props) {
	const logger = yield* getLoggerFx("activityCountFx");
	logger.trace("activityCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withActivitySelectFx({}),
		where,
		scope,
	});
});

export type activityCountFx = ReturnType<typeof activityCountFx>;
