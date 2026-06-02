import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withCategorySelectFx } from "~/public/category/server/db/withCategorySelectFx";
import type { CategoryQuerySchema } from "~/public/category/server/schema/CategoryQuerySchema";
import type { CategoryWhereSchema } from "../schema/CategoryWhereSchema";

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
