import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withCategoryQueryBuilderFx } from "../db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { CategorySchema } from "../schema/CategorySchema";

export namespace categoryFetchFx {
	export type Props = CategoryQuerySchema.Type;
}

export const categoryFetchFx = Effect.fn("categoryFetchFx")(function* ({
	filter,
	where,
	sort,
}: categoryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "category",
		select: yield* withCategorySelectFx({
			sort,
		}),
		output: CategorySchema,
		filter,
		where,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
