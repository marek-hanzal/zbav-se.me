import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withCategorySelectFx } from "~/public-category/db/withCategorySelectFx";
import type { CategoryQuerySchema } from "~/public-category/schema/CategoryQuerySchema";
import type { CategoryWhereSchema } from "~/public-category/schema/CategoryWhereSchema";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: categoryCollectionFx.Props) {
	const logger = yield* getLoggerFx("categoryCollectionFx");
	logger.trace("categoryCollectionFx", {
		cursor,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withCategorySelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
