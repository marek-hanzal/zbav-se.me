import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCategoryCollectionSelectFx } from "~/@session/category/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/@session/category/db/withCategoryQueryBuilderFx";
import type { CategoryCountQuerySchema } from "~/@session/category/schema/CategoryCountQuerySchema";
import type { CategoryFilterSchema } from "~/@session/category/schema/CategoryFilterSchema";

export namespace categoryCountFx {
	export interface Props extends CategoryCountQuerySchema.Type {
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: categoryCountFx.Props) {
	yield* Effect.annotateLogsScoped({
		"categoryCountFx.filter": filter,
		"categoryCountFx.where": where,
		"categoryCountFx.scope": scope,
		"categoryCountFx.count": count,
	});

	return yield* withCountFx({
		selectFx: withCategoryCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
