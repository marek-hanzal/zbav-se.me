import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { categoryMissCreateFx } from "~/session/category-miss/server/fx/categoryMissCreateFx";
import { withCategoryCollectionSelectFx } from "~/user/category/server/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/user/category/server/db/withCategoryQueryBuilderFx";
import type { CategoryFilterSchema } from "~/user/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		userId: string;
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	userId,
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

	const data = yield* withCollectionFx({
		selectFx: withCategoryCollectionSelectFx({
			sort,
			userId,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx(query) {
			return withCategoryQueryBuilderFx({
				userId,
				...query,
			});
		},
	});

	if (data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: filter?.fulltext ?? where?.fulltext ?? undefined,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
