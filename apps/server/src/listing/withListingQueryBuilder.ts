import type { SelectQueryBuilder } from "kysely";
import type { Database } from "../database/Database";
import type { ListingQuerySchema } from "./schema/ListingQuerySchema";

export namespace withListingQueryBuilder {
	export interface Props {
		select: SelectQueryBuilder<Database, "Listing", any>;
		where?: ListingQuerySchema.Type["where"];
		sort?: ListingQuerySchema.Type["sort"];
	}

	export type Callback = (
		props: Props,
	) => SelectQueryBuilder<Database, "Listing", any>;
}

/**
 * Standalone query builder that applies all filters from ListingQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingQueryBuilder: withListingQueryBuilder.Callback = ({
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
		// For listings, we can search in category/categoryGroup names via joins
		// For now, we'll skip fulltext search since listings don't have text fields
		// This could be enhanced later with proper joins to category tables
	}

	// Apply custom filters

	if (where?.priceMin !== undefined) {
		query = query.where("price", ">=", where.priceMin);
	}

	if (where?.priceMax !== undefined) {
		query = query.where("price", "<=", where.priceMax);
	}

	if (where?.conditionMin !== undefined) {
		query = query.where("condition", ">=", where.conditionMin);
	}

	if (where?.conditionMax !== undefined) {
		query = query.where("condition", "<=", where.conditionMax);
	}

	if (where?.ageMin !== undefined) {
		query = query.where("age", ">=", where.ageMin);
	}

	if (where?.ageMax !== undefined) {
		query = query.where("age", "<=", where.ageMax);
	}

	if (where?.locationId) {
		query = query.where("locationId", "=", where.locationId);
	}

	if (where?.locationIdIn && where.locationIdIn.length > 0) {
		query = query.where("locationId", "in", where.locationIdIn);
	}

	if (where?.categoryGroupId) {
		query = query.where("categoryGroupId", "=", where.categoryGroupId);
	}

	if (where?.categoryGroupIdIn && where.categoryGroupIdIn.length > 0) {
		query = query.where("categoryGroupId", "in", where.categoryGroupIdIn);
	}

	if (where?.categoryId) {
		query = query.where("categoryId", "=", where.categoryId);
	}

	if (where?.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("categoryId", "in", where.categoryIdIn);
	}

	return query;
};

/**
 * Extended query builder that also handles sorting
 */
export const withListingQueryBuilderWithSort = (
	props: withListingQueryBuilder.Props,
) => {
	let query = withListingQueryBuilder(props);

	// Apply sorting
	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "price":
					query = query.orderBy("price", sortItem.sort);
					break;
				case "condition":
					query = query.orderBy("condition", sortItem.sort);
					break;
				case "age":
					query = query.orderBy("age", sortItem.sort);
					break;
				case "createdAt":
					query = query.orderBy("createdAt", sortItem.sort);
					break;
				case "updatedAt":
					query = query.orderBy("updatedAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
