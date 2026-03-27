import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withCategoryQueryBuilderFx } from "~/client/@session/category/server/db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "~/client/@session/category/server/db/withCategorySelectFx";
import type { CategoryFilterSchema } from "~/client/@session/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/client/@session/category/server/schema/CategoryQuerySchema";

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
