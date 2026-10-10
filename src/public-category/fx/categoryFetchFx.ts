import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withCategorySelectFx } from "~/public-category/db/withCategorySelectFx";
import type { CategoryQuerySchema } from "~/public-category/schema/CategoryQuerySchema";
import type { CategoryWhereSchema } from "~/public-category/schema/CategoryWhereSchema";

export namespace categoryFetchFx {
	export interface Props extends CategoryQuerySchema.Type {
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryFetchFx = Effect.fn("categoryFetchFx")(function* ({
	where,
	scope,
	sort,
}: categoryFetchFx.Props) {
	const logger = yield* getLoggerFx("categoryFetchFx");
	logger.trace("categoryFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "category",
		selectFx: withCategorySelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
