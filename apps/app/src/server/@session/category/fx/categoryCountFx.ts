import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCategoryCollectionSelectFx } from "~/server/@session/category/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/server/@session/category/db/withCategoryQueryBuilderFx";
import type { CategoryCountQuerySchema } from "~/server/@session/category/schema/CategoryCountQuerySchema";
import type { CategoryFilterSchema } from "~/server/@session/category/schema/CategoryFilterSchema";

export namespace categoryCountFx {
	export interface Props extends CategoryCountQuerySchema.Type {
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	filter,
	where,
	scope,
}: categoryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withCategoryCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
