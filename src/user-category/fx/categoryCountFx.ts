import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withCategorySelectFx } from "~/user-category/db/withCategorySelectFx";
import type { CategoryCountQuerySchema } from "~/user-category/schema/CategoryCountQuerySchema";
import type { CategoryWhereSchema } from "~/user-category/schema/CategoryWhereSchema";

export namespace categoryCountFx {
	export interface Props extends CategoryCountQuerySchema.Type {
		userId: string;
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryCountFx = Effect.fn("categoryCountFx")(function* ({
	userId,
	where,
	scope,
}: categoryCountFx.Props) {
	const logger = yield* getLoggerFx("categoryCountFx");
	logger.trace("categoryCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withCategorySelectFx({
			userId,
		}),
		where,
		scope,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
