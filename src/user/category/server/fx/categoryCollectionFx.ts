import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { categoryMissCreateFx } from "~/session/category-miss/server/fx/categoryMissCreateFx";
import type { CategoryFilterSchema } from "~/user/category/server/schema/CategoryFilterSchema";
import type { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";
import { withCategorySelectFx } from "../db/withCategorySelectFx";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		userId: string;
		scope: CategoryFilterSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
}: categoryCollectionFx.Props) {
	const logger = yield* getLoggerFx("categoryCollectionFx");
	logger.trace("categoryCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
	});

	const data = yield* withCollectionFx({
		selectFx: withCategorySelectFx({
			sort,
			userId,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});

	if (data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: filter?.fulltext ?? where?.fulltext ?? undefined,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
