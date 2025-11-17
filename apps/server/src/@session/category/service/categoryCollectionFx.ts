import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { categoryMissCreateFx } from "../../category-miss/service/categoryMissCreateFx";
import { withCategoryQueryBuilder } from "../db/withCategoryQueryBuilder";
import { withCategorySelect } from "../db/withCategorySelect";
import type { CategoryQuerySchema } from "../schema/CategoryQuerySchema";
import { CategorySchema } from "../schema/CategorySchema";

export namespace categoryCollectionFx {
	export interface Props {
		database: WithDatabase;
		query: CategoryQuerySchema.Type;
	}
}

export const categoryCollectionFx = ({
	database,
	query: { cursor, filter, where, sort },
}: categoryCollectionFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			return withCollection({
				select: withCategorySelect({
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
		});

		if (data.data.length === 0) {
			yield* categoryMissCreateFx({
				database,
				fulltext: filter?.fulltext || where?.fulltext,
			});
		}

		return data;
	});
};

export type categoryCollectionFx = ReturnType<typeof categoryCollectionFx>;
