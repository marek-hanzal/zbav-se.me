import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withFieldSelectFx } from "~/user-field/db/withFieldSelectFx";
import type { FieldQuerySchema } from "~/user-field/schema/FieldQuerySchema";
import type { FieldWhereSchema } from "~/user-field/schema/FieldWhereSchema";

export namespace fieldCollectionFx {
	export interface Props extends FieldQuerySchema.Type {
		scope: FieldWhereSchema.Type;
	}
}

export const fieldCollectionFx = Effect.fn("fieldCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	where,
	scope,
	sort,
}: fieldCollectionFx.Props) {
	const logger = yield* getLoggerFx("fieldCollectionFx");
	logger.trace("fieldCollectionFx", {
		cursor,
		limit,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withFieldSelectFx({
			sort,
		}),
		cursor,
		limit,
		where,
		scope,
	});
});

export type fieldCollectionFx = ReturnType<typeof fieldCollectionFx>;
