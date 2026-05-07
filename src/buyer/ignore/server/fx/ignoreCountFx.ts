import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withIgnoreSelectFx } from "~/buyer/ignore/server/db/withIgnoreSelectFx";
import type { IgnoreCountQuerySchema } from "~/buyer/ignore/server/schema/IgnoreCountQuerySchema";
import type { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";

export namespace ignoreCountFx {
	export interface Props extends IgnoreCountQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	filter,
	where,
	scope,
}: ignoreCountFx.Props) {
	const logger = yield* getLoggerFx("ignoreCountFx");
	logger.trace("ignoreCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withIgnoreSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;
