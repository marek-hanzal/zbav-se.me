import { Effect } from "effect";
import { withIgnoreSelectFx } from "~/buyer/listing-ignore/server/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/buyer/listing-ignore/server/schema/IgnoreQuerySchema";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
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
