import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withIgnoreSelectFx } from "~/buyer/ignore/server/db/withIgnoreSelectFx";
import type { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";
import type { IgnoreQuerySchema } from "~/buyer/ignore/server/schema/IgnoreQuerySchema";

export namespace ignoreCollectionFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreFilterSchema.Type;
	}
}

export const ignoreCollectionFx = Effect.fn("ignoreCollectionFx")(function* ({
	filter,
	where,
	scope,
	sort,
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
}: ignoreCollectionFx.Props) {
	const logger = yield* getLoggerFx("ignoreCollectionFx");
	logger.trace("ignoreCollectionFx", {
		filter,
		where,
		scope,
		sort,
		cursor,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withIgnoreSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
	});
});

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;
