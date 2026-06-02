import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { categoryMissCreateFx } from "~/session/category-miss/server/fx/categoryMissCreateFx";
import type { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";
import { withCategorySelectFx } from "../db/withCategorySelectFx";
import type { CategoryWhereSchema } from "../schema/CategoryWhereSchema";

export namespace categoryCollectionFx {
	export interface Props extends CategoryQuerySchema.Type {
		userId: string;
		scope: CategoryWhereSchema.Type;
	}
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	where,
	scope,
	sort,
}: categoryCollectionFx.Props) {
	const logger = yield* getLoggerFx("categoryCollectionFx");
	logger.trace("categoryCollectionFx", {
		cursor,
		limit,
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
		where,
		scope,
		limit,
	});

	if (data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: where?.fulltext ?? undefined,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
