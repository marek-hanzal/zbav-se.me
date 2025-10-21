import type { SelectQueryBuilder } from "kysely";
import type { Database } from "../database/Database.js";
import type { LocationQuerySchema } from "./schema/LocationQuerySchema.js";

export namespace withLocationQueryBuilder {
	export interface Props {
		select: SelectQueryBuilder<Database, "location", any>;
		where?: LocationQuerySchema.Type["where"];
		sort?: LocationQuerySchema.Type["sort"];
	}

	export type Callback = (
		props: Props,
	) => SelectQueryBuilder<Database, "location", any>;
}

/**
 * Standalone query builder that applies all filters from LocationQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withLocationQueryBuilder: withLocationQueryBuilder.Callback = ({
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
				eb("query", "ilike", `%${where.fulltext}%`),
				eb("address", "ilike", `%${where.fulltext}%`),
				eb("country", "ilike", `%${where.fulltext}%`),
				eb("municipality", "ilike", `%${where.fulltext}%`),
				eb("state", "ilike", `%${where.fulltext}%`),
				eb("county", "ilike", `%${where.fulltext}%`),
			]),
		);
	}

	// Apply custom filters
	if (where?.query) {
		query = query.where("query", "=", where.query);
	}

	if (where?.lang) {
		query = query.where("lang", "=", where.lang);
	}

	if (where?.country) {
		query = query.where("country", "=", where.country);
	}

	if (where?.code) {
		query = query.where("code", "=", where.code);
	}

	if (where?.confidenceMin !== undefined) {
		query = query.where("confidence", ">=", where.confidenceMin);
	}

	return query;
};

/**
 * Extended query builder that also handles sorting
 */
export const withLocationQueryBuilderWithSort = (
	props: withLocationQueryBuilder.Props,
) => {
	let query = withLocationQueryBuilder(props);

	// Apply sorting
	for (const sortItem of props.sort ?? []) {
		if (sortItem.sort) {
			switch (sortItem.value) {
				case "confidence":
					query = query.orderBy("confidence", sortItem.sort);
					break;
				case "query":
					query = query.orderBy("query", sortItem.sort);
					break;
				case "country":
					query = query.orderBy("country", sortItem.sort);
					break;
				case "address":
					query = query.orderBy("address", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
