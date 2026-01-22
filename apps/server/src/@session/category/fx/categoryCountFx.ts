import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCategoryCollectionSelectFx } from "../db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import type { CategoryCountQuerySchema } from "../schema/CategoryCountQuerySchema";
import type { CategoryFilterSchema } from "../schema/CategoryFilterSchema";

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
