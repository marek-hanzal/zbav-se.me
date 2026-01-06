import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryCountQuerySchema } from "../schema/CategoryCountQuerySchema";

export namespace categoryCountFx {
	export type Props = CategoryCountQuerySchema.Type;
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	filter,
	where,
}: categoryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withCategorySelectFx({}),
		filter,
		where,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
