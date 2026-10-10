import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withCategorySelectFx } from "~/user-category/db/withCategorySelectFx";
import type { CategoryQuerySchema } from "~/user-category/schema/CategoryQuerySchema";
import type { CategoryWhereSchema } from "~/user-category/schema/CategoryWhereSchema";

export namespace categoryFetchFx {
	export interface Props extends CategoryQuerySchema.Type {
		userId: string;
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryFetchFx = Effect.fn("categoryFetchFx")(function* ({
	userId,
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
			userId,
			sort,
		}),
		where,
		scope,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
