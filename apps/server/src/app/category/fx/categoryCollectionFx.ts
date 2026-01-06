import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { categoryMissCreateFx } from "~/app/category-miss/fx/categoryMissCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";

export namespace categoryCollectionFx {
	export type Props = CategoryQuerySchema.Type;
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: categoryCollectionFx.Props) {
	const data = yield* withCollectionFx({
		selectFx: withCategorySelectFx({
			sort,
		}),
		output: CategorySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<categoryCollectionFx>, UserContextFx>>;
