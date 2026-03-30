import { Effect } from "effect";
import type { withCategoryMissSelectFx } from "~/session/category-miss/server/db/withCategoryMissSelectFx";
import type { CategoryMissFilterSchema } from "~/session/category-miss/server/schema/CategoryMissFilterSchema";

export namespace withCategoryMissQueryBuilderFx {
	export interface Props {
		select: withCategoryMissSelectFx.Select;
		where?: CategoryMissFilterSchema.Type;
	}

	export type Callback = (props: Props) => withCategoryMissSelectFx.Select;
}

/**
 * Query builder for CategoryMiss operations
 */
export const withCategoryMissQueryBuilderFx = Effect.fn("withCategoryMissQueryBuilderFx")(
	function* ({ select, where }: withCategoryMissQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where?.id) {
			query = query.where("cm.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("cm.id", "in", where.idIn);
		}

		if (where?.fulltext) {
			const fulltext = where.fulltext;
			query = query.where((eb) =>
				eb.or([
					eb("cm.category", "ilike", `%${fulltext}%`),
				]),
			);
		}

		if (where?.category) {
			query = query.where("cm.category", "=", where.category);
		}

		return yield* Effect.succeed(query);
	},
);
