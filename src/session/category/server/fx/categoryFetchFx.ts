import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withCategoryQueryBuilderFx } from "~/session/category/server/db/withCategoryQueryBuilderFx";
import { withCategorySelectFx } from "~/session/category/server/db/withCategorySelectFx";
import type { CategoryFilterSchema } from "~/session/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";

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
	const logger = yield* getLoggerFx("categoryFetchFx");
	logger.debug("categoryFetchFx", {
		filter,
		where,
		scope,
		sort,
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
