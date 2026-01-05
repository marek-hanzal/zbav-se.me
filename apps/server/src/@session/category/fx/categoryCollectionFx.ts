import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { categoryMissCreateFx } from "~/@session/category-miss/fx/categoryMissCreateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { CategorySchema } from "../schema/CategorySchema";

export namespace categoryCollectionFx {
	export type Props = CategoryQuerySchema.Type;
}

export const categoryCollectionFx = Effect.fn("categoryCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: categoryCollectionFx.Props) {
	const database = yield* DatabaseContextFx;

	const data = yield* withCollectionFx({
		select: withCategorySelect({
			database,
			sort,
		}),
		output: CategorySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		query: withCategoryQueryBuilder,
	});

	if (data.data.length === 0) {
		yield* categoryMissCreateFx({
			fulltext: filter?.fulltext || where?.fulltext,
		});
	}

	return data;
});

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
