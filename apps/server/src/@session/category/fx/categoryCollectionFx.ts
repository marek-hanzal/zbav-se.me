import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withCategoryCollectionSelectFx } from "~/@session/category/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/@session/category/db/withCategoryQueryBuilderFx";
import type { CategoryFilterSchema } from "~/@session/category/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/@session/category/schema/CategoryQuerySchema";
import { categoryMissCreateFx } from "~/@session/category-miss/fx/categoryMissCreateFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "categoryCollectionFx",
		input: {
			cursor,
			filter,
			where,
			scope,
			sort,
		},
	});

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
			fulltext: filter?.fulltext || where?.fulltext,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
