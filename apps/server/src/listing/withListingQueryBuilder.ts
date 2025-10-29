import { sql } from "kysely";
import { match } from "ts-pattern";
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
		// For listings, we can search in category names via joins
		// For now, we'll skip fulltext search since listings don't have text fields
		// This could be enhanced later with proper joins to category tables
	}

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

	for (const sortItem of props.sort ?? []) {
		query = match(sortItem)
			.with(
				{
					type: "listing",
				},
				(sort) => {
					if (!sort.sort) {
						return query;
					}
					const { sort: key, value } = sort;

					return match(value)
						.with("price", () => query.orderBy("l.price", key))
						.with("condition", () =>
							query.orderBy("l.condition", key),
						)
						.with("age", () => query.orderBy("l.age", key))
						.with("createdAt", () =>
							query.orderBy("l.createdAt", key),
						)
						.with("updatedAt", () =>
							query.orderBy("l.updatedAt", key),
						)
						.with("expiresAt", () =>
							query.orderBy("l.expiresAt", key),
						)
						.exhaustive();
				},
			)
			.with(
				{
					type: "geo",
				},
				(sort) => {
					const { sort: key, lon, lat } = sort;
					if (!key) {
						return query;
					}

					return query.orderBy(
						sql`ST_Distance(l.geo, ST_Point(${lon}, ${lat}))`,
						key,
					);
				},
			)
			.with(null, () => query)
			.with(undefined, () => query)
			.exhaustive();
	}

	return query;
};
