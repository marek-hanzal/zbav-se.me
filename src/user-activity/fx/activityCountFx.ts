import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withActivitySelectFx } from "~/user-activity/db/withActivitySelectFx";
import type { ActivityCountQuerySchema } from "~/user-activity/schema/ActivityCountQuerySchema";
import type { ActivityWhereSchema } from "~/user-activity/schema/ActivityWhereSchema";

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
