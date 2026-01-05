import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
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
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "category",
		select: withCategorySelect({
			database,
			sort,
		}),
		output: CategorySchema,
		filter,
		where,
		query: withCategoryQueryBuilder,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
