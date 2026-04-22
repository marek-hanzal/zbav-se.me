import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withCategoryCollectionSelectFx } from "~/public/category/server/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/public/category/server/db/withCategoryQueryBuilderFx";
import type { CategoryFilterSchema } from "~/public/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/public/category/server/schema/CategoryQuerySchema";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: categoryCollectionFx.Props) {
	const logger = yield* getLoggerFx("categoryCollectionFx");
	logger.trace("categoryCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withCategoryCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
