import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withCategoryQueryBuilderFx } from "~/server/@session/category/db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "~/server/@session/category/db/withCategorySelectFx";
import type { CategoryFilterSchema } from "~/server/@session/category/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/server/@session/category/schema/CategoryQuerySchema";

export namespace categoryFetchFx {
	export interface Props extends CategoryQuerySchema.Type {
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryFetchFx = Effect.fn("categoryFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: categoryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "category",
		selectFx: withCategorySelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
