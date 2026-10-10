import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withFieldOptionSelectFx } from "~/user-field-option/db/withFieldOptionSelectFx";
import type { FieldOptionQuerySchema } from "~/user-field-option/schema/FieldOptionQuerySchema";
import type { FieldOptionWhereSchema } from "~/user-field-option/schema/FieldOptionWhereSchema";

export namespace fieldOptionCollectionFx {
	export interface Props extends FieldOptionQuerySchema.Type {
		scope: FieldOptionWhereSchema.Type;
	}
}

export const fieldOptionCollectionFx = Effect.fn("fieldOptionCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	where,
	scope,
	sort,
}: fieldOptionCollectionFx.Props) {
	const logger = yield* getLoggerFx("fieldOptionCollectionFx");
	logger.trace("fieldOptionCollectionFx", {
		cursor,
		limit,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFieldOptionSelectFx({
			sort,
		}),
		cursor,
		limit,
		where,
		scope,
	});
});

export type fieldOptionCollectionFx = ReturnType<typeof fieldOptionCollectionFx>;
