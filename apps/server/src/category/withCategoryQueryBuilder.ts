import type { SelectQueryBuilder } from "kysely";
import type { Database } from "../database/Database";
import type { CategoryQuerySchema } from "./schema/CategoryQuerySchema";

export namespace withCategoryQueryBuilder {
	export interface Props {
		select: SelectQueryBuilder<Database, "Category", any>;
		where?: CategoryQuerySchema.Type["where"];
		sort?: CategoryQuerySchema.Type["sort"];
	}

	export type Callback = (
		props: Props,
	) => SelectQueryBuilder<Database, "Category", any>;
}

/**
 * Standalone query builder that applies all filters from CategoryQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withCategoryQueryBuilder: withCategoryQueryBuilder.Callback = ({
	select,
	where,
}) => {
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
				eb("name", "ilike", `%${where.fulltext}%`),
			]),
		);
	}

	// Apply custom filters
	if (where?.name) {
		query = query.where("name", "like", `%${where.name}%`);
	}

	if (where?.categoryGroupId) {
		query = query.where("categoryGroupId", "=", where.categoryGroupId);
	}

	if (where?.categoryGroupIdIn && where.categoryGroupIdIn.length > 0) {
		query = query.where("categoryGroupId", "in", where.categoryGroupIdIn);
	}

	if (where?.locale) {
		query = query.where("locale", "=", where.locale);
	}

	if (where?.localeIn && where.localeIn.length > 0) {
		query = query.where("locale", "in", where.localeIn);
	}

	return query;
};

/**
 * Extended query builder that also handles sorting
 */
export const withCategoryQueryBuilderWithSort = (
	props: withCategoryQueryBuilder.Props,
) => {
	let query = withCategoryQueryBuilder(props);

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
