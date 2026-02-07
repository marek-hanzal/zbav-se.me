import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withCategoryQueryBuilderFx } from "~/@session/category/db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "~/@session/category/db/withCategorySelectFx";
import type { CategoryFilterSchema } from "~/@session/category/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/@session/category/schema/CategoryQuerySchema";

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
	yield* Effect.annotateLogsScoped({
		"categoryFetchFx.filter": filter,
		"categoryFetchFx.where": where,
		"categoryFetchFx.scope": scope,
		"categoryFetchFx.sort": sort,
	});

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
