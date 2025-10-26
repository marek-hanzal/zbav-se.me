import type { CategoryGroupQuerySchema } from "./schema/CategoryGroupQuerySchema";
import type { withCategoryGroupSelect } from "./withCategoryGroupSelect";

export namespace withCategoryGroupQueryBuilder {
	export interface Props {
		select: withCategoryGroupSelect.Select;
		where?: CategoryGroupQuerySchema.Type["where"];
		sort?: CategoryGroupQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withCategoryGroupSelect.Select;
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
			query = query.where("cg.id", "=", where.id);
		}

		if (where?.idIn && where.idIn.length > 0) {
			query = query.where("cg.id", "in", where.idIn);
		}

		if (where?.fulltext) {
			query = query.where((eb) =>
				eb.or([
					eb("cg.name", "ilike", `%${where.fulltext}%`),
				]),
			);
		}

		// Apply custom filters
		if (where?.name) {
			query = query.where("cg.name", "like", `%${where.name}%`);
		}

		if (where?.locale) {
			query = query.where("cg.locale", "=", where.locale);
		}

		if (where?.localeIn && where.localeIn.length > 0) {
			query = query.where("cg.locale", "in", where.localeIn);
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
					query = query.orderBy("cg.name", sortItem.sort);
					break;
				case "sort":
					query = query.orderBy("cg.sort", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
