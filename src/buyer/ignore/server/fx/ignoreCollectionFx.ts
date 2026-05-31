import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withIgnoreSelectFx } from "~/buyer/ignore/server/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/buyer/ignore/server/schema/IgnoreQuerySchema";
import type { IgnoreWhereSchema } from "../schema/IgnoreWhereSchema";

export namespace ignoreCollectionFx {
	export interface Props extends IgnoreQuerySchema.Type {
		scope: IgnoreWhereSchema.Type;
	}
}

export const ignoreCollectionFx = Effect.fn("ignoreCollectionFx")(function* ({
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
		where,
		scope,
	});
});

export type ignoreCollectionFx = ReturnType<typeof ignoreCollectionFx>;
