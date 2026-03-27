import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withCategoryCollectionSelectFx } from "~/client/@session/category/server/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/client/@session/category/server/db/withCategoryQueryBuilderFx";
import type { CategoryFilterSchema } from "~/client/@session/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/client/@session/category/server/schema/CategoryQuerySchema";
import { categoryMissCreateFx } from "~/client/@session/category-miss/server/fx/categoryMissCreateFx";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: categoryCollectionFx.Props) {
	const data = yield* withCollectionFx({
		selectFx: withCategoryCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});

	if (data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: filter?.fulltext ?? where?.fulltext ?? undefined,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
