import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withCategoryCollectionSelectFx } from "~/user/category/server/db/withCategoryCollectionSelectFx";
import { withCategoryQueryBuilderFx } from "~/user/category/server/db/withCategoryQueryBuilderFx";
import type { CategoryCountQuerySchema } from "~/user/category/server/schema/CategoryCountQuerySchema";
import type { CategoryFilterSchema } from "~/user/category/server/schema/CategoryFilterSchema";

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
	const logger = yield* getLoggerFx("categoryCountFx");
	logger.trace("categoryCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withCategoryCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withCategoryQueryBuilderFx,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
