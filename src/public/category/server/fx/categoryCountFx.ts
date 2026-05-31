import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { CategoryCountQuerySchema } from "~/public/category/server/schema/CategoryCountQuerySchema";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryWhereSchema } from "../schema/CategoryWhereSchema";

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
