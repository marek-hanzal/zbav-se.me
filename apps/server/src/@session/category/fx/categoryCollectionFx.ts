import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { categoryMissCreateFx } from "~/@session/category-miss/fx/categoryMissCreateFx";
import { withCategoryCollectionSelectFx } from "../db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import type { CategoryFilterSchema } from "../schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";

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

	if (data.data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: filter?.fulltext || where?.fulltext,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
