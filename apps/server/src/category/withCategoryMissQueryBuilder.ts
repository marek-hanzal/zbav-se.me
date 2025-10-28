import type { CategoryMissQuerySchema } from "./schema/CategoryMissQuerySchema";
import type { withCategoryMissSelect } from "./withCategoryMissSelect";

export namespace withCategoryMissQueryBuilder {
	export interface Props {
		select: withCategoryMissSelect.Select;
		where?: CategoryMissQuerySchema.Type["where"];
		sort?: CategoryMissQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withCategoryMissSelect.Select;
}

/**
 * Query builder for CategoryMiss operations
 */
export const withCategoryMissQueryBuilder: withCategoryMissQueryBuilder.Callback =
	({ select, where }) => {
		let query = select;

		if (where?.id) {
			query = query.where("cm.id", "=", where.id);
		}

		if (where?.idIn?.length) {
			query = query.where("cm.id", "in", where.idIn);
		}

		if (where?.fulltext) {
			const term = where.fulltext;
			query = query.where((eb) =>
				eb.or([
					eb("cm.category", "ilike", `%${term}%`),
				]),
			);
		}

		if (where?.category) {
			query = query.where("cm.category", "=", where.category);
		}

		return query;
	};

/**
 * Extended query builder that also handles sorting
 */
export const withCategoryMissQueryBuilderWithSort = (
	props: withCategoryMissQueryBuilder.Props,
) => {
	let query = withCategoryMissQueryBuilder(props);

	// Apply sorting
	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "category":
					query = query.orderBy("cm.category", sortItem.sort);
					break;
				case "count":
					query = query.orderBy("cm.count", sortItem.sort);
					break;
				case "updatedAt":
					query = query.orderBy("cm.updatedAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
