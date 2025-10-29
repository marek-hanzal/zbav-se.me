import { sql } from "kysely";
import { match } from "ts-pattern";
import type { ListingQuerySchema } from "./schema/ListingQuerySchema";
import type { withListingSelect } from "./withListingSelect";

export namespace withListingQueryBuilder {
	export interface Props {
		select: withListingSelect.Select;
		where?: ListingQuerySchema.Type["where"];
		sort?: ListingQuerySchema.Type["sort"];
		params?: ListingQuerySchema.Type["params"];
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

	// 1) Primary geo sort (if provided)
	if (props.params?.geo?.locationId) {
		const refId = props.params.geo.locationId;
		const dir = props.params.geo.sort ?? "asc";

		// TODO Receive "geo" column directly instead of using subquery
		// - listing.geo (e.g. "0101000020E6100000DC662AC4239D30409E25C808A8984840")
		// const refGeom = sql`ST_GeomFromEWKB(decode(${ewkbHex}, 'hex'))`;
		// - keep "sorts" only process one specific sort key?

		// TODO - ('SRID=4326;POINT(14.42076 50.08804)')::geometry

		query = query.orderBy(
			sql`
          (select geo from "location" where id = l."locationId")
          <->
          (select geo from "location" where id = ${refId})
        `,
			dir,
		);
	}

	// 2) Secondary sorts (tiebreakers)
	for (const sortItem of props.sort ?? []) {
		const { sort: dir, value } = sortItem;
		if (!dir) continue;

		query = match(value)
			.with("price", () => query.orderBy("l.price", dir))
			.with("condition", () => query.orderBy("l.condition", dir))
			.with("age", () => query.orderBy("l.age", dir))
			.with("createdAt", () => query.orderBy("l.createdAt", dir))
			.with("updatedAt", () => query.orderBy("l.updatedAt", dir))
			.with("expiresAt", () => query.orderBy("l.expiresAt", dir))
			.exhaustive();
	}

	return query;
};
