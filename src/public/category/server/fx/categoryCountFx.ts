import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { CategoryCountQuerySchema } from "~/public/category/server/schema/CategoryCountQuerySchema";
import type { CategoryFilterSchema } from "~/public/category/server/schema/CategoryFilterSchema";
import { withCategorySelectFx } from "../db/withCategorySelectFx";

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
		selectFx: withCategorySelectFx({}),
		filter,
		where,
		scope,
	});
});

export type categoryCountFx = ReturnType<typeof categoryCountFx>;
