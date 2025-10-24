import type { ListingQuerySchema } from "./schema/ListingQuerySchema";
import type { withListingSelect } from "./withListingSelect";

export namespace withListingQueryBuilder {
	export interface Props {
		select: withListingSelect.Select;
		where?: ListingQuerySchema.Type["where"];
		sort?: ListingQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withListingSelect.Select;
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
		query = query.where("l.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn);
	}

	if (where?.fulltext) {
		// For listings, we can search in category/categoryGroup names via joins
		// For now, we'll skip fulltext search since listings don't have text fields
		// This could be enhanced later with proper joins to category tables
	}

	// Apply custom filters

	if (where?.priceMin !== undefined) {
		query = query.where("l.price", ">=", where.priceMin);
	}

	if (where?.priceMax !== undefined) {
		query = query.where("l.price", "<=", where.priceMax);
	}

	if (where?.conditionMin !== undefined) {
		query = query.where("l.condition", ">=", where.conditionMin);
	}

	if (where?.conditionMax !== undefined) {
		query = query.where("l.condition", "<=", where.conditionMax);
	}

	if (where?.ageMin !== undefined) {
		query = query.where("l.age", ">=", where.ageMin);
	}

	if (where?.ageMax !== undefined) {
		query = query.where("l.age", "<=", where.ageMax);
	}

	if (where?.locationId) {
		query = query.where("l.locationId", "=", where.locationId);
	}

	if (where?.locationIdIn && where.locationIdIn.length > 0) {
		query = query.where("l.locationId", "in", where.locationIdIn);
	}

	if (where?.categoryGroupId) {
		query = query.where("l.categoryGroupId", "=", where.categoryGroupId);
	}

	if (where?.categoryGroupIdIn && where.categoryGroupIdIn.length > 0) {
		query = query.where("l.categoryGroupId", "in", where.categoryGroupIdIn);
	}

	if (where?.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId);
	}

	if (where?.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn);
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
					query = query.orderBy("l.price", sortItem.sort);
					break;
				case "condition":
					query = query.orderBy("l.condition", sortItem.sort);
					break;
				case "age":
					query = query.orderBy("l.age", sortItem.sort);
					break;
				case "createdAt":
					query = query.orderBy("l.createdAt", sortItem.sort);
					break;
				case "updatedAt":
					query = query.orderBy("l.updatedAt", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
