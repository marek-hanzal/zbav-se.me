import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import type { CategoryFilterSchema } from "~/app/category/schema/CategoryFilterSchema";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryCountQuerySchema } from "../schema/CategoryCountQuerySchema";

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
		selectFx: withCategorySelectFx({}),
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
