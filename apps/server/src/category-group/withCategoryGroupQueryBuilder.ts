import type { CategoryGroupQuerySchema } from "@zbav-se.me/common";
import type { SelectQueryBuilder } from "kysely";
import type { Database } from "../database/Database";

export namespace withCategoryGroupQueryBuilder {
	export interface Props {
		select: SelectQueryBuilder<Database, "CategoryGroup", any>;
		where?: CategoryGroupQuerySchema.Type["where"];
		sort?: CategoryGroupQuerySchema.Type["sort"];
	}

	export type Callback = (
		props: Props,
	) => SelectQueryBuilder<Database, "CategoryGroup", any>;
}

/**
 * Standalone query builder that applies all filters from CategoryGroupQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withCategoryGroupQueryBuilder: withCategoryGroupQueryBuilder.Callback =
	({ select, where }) => {
		let query = select;

		// Apply base filters
		if (where?.id) {
			query = query.where("id", "=", where.id);
		}

		if (where?.idIn && where.idIn.length > 0) {
			query = query.where("id", "in", where.idIn);
		}

		if (where?.fulltext) {
			query = query.where((eb) =>
				eb.or([
					eb("name", "like", `%${where.fulltext}%`),
				]),
			);
		}

		// Apply custom filters
		if (where?.name) {
			query = query.where("name", "like", `%${where.name}%`);
		}

		return query;
	};

/**
 * Extended query builder that also handles sorting
 */
export const withCategoryGroupQueryBuilderWithSort = (
	props: withCategoryGroupQueryBuilder.Props,
) => {
	let query = withCategoryGroupQueryBuilder(props);

	// Apply sorting
	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "name":
					query = query.orderBy("name", sortItem.sort);
					break;
				case "sort":
					query = query.orderBy("sort", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
