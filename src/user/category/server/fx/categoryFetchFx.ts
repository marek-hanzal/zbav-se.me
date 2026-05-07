import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import type { CategoryFilterSchema } from "~/user/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";
import { withCategorySelectFx } from "../db/withCategorySelectFx";

export namespace categoryFetchFx {
	export interface Props extends CategoryQuerySchema.Type {
		userId: string;
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryFetchFx = Effect.fn("categoryFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: categoryFetchFx.Props) {
	const logger = yield* getLoggerFx("categoryFetchFx");
	logger.trace("categoryFetchFx", {
		filter,
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
		filter,
		where,
		scope,
	});
});

export type categoryFetchFx = ReturnType<typeof categoryFetchFx>;
