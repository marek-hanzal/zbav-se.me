import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withCategorySelectFx } from "~/public-category/db/withCategorySelectFx";
import type { CategoryCountQuerySchema } from "~/public-category/schema/CategoryCountQuerySchema";
import type { CategoryWhereSchema } from "~/public-category/schema/CategoryWhereSchema";

export namespace categoryCountFx {
	export interface Props extends CategoryCountQuerySchema.Type {
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	where,
	scope,
}: categoryCountFx.Props) {
	const logger = yield* getLoggerFx("categoryCountFx");
	logger.trace("categoryCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withCategorySelectFx({}),
		where,
		scope,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
