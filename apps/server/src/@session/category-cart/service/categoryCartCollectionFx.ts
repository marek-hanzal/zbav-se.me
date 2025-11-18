import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withCategoryQueryBuilder } from "../../category/db/withCategoryQueryBuilder";
import { withCategoryCartSelect } from "../db/withCategoryCartSelect";
import type { CategoryCartQuerySchema } from "../schema/CategoryCartQuerySchema";
import { CategoryCartSchema } from "../schema/CategoryCartSchema";

export namespace categoryCartCollectionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: CategoryCartQuerySchema.Type;
	}
}

export const categoryCartCollectionFx = ({
	database,
	userId,
	query: { cursor, filter, where, sort },
}: categoryCartCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withCategoryCartSelect({
					database,
					sort,
					userId,
				}),
				output: CategoryCartSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withCategoryQueryBuilder,
			});
		});
	});
};

export type categoryCartCollectionFx = ReturnType<typeof categoryCartCollectionFx>;
