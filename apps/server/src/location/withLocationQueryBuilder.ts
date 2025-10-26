import type { LocationQuerySchema } from "./schema/LocationQuerySchema";
import type { withLocationSelect } from "./withLocationSelect";

export namespace withLocationQueryBuilder {
	export interface Props {
		select: withLocationSelect.Select;
		where?: LocationQuerySchema.Type["where"];
		sort?: LocationQuerySchema.Type["sort"];
	}

	export type Callback = (props: Props) => withLocationSelect.Select;
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
		query = query.where("l.id", "=", where.id);
	}

	if (where?.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn);
	}

	if (where?.fulltext) {
		query = query.where((eb) =>
			eb.or([
				eb("l.query", "ilike", `%${where.fulltext}%`),
				eb("l.address", "ilike", `%${where.fulltext}%`),
				eb("l.country", "ilike", `%${where.fulltext}%`),
				eb("l.municipality", "ilike", `%${where.fulltext}%`),
				eb("l.state", "ilike", `%${where.fulltext}%`),
				eb("l.county", "ilike", `%${where.fulltext}%`),
			]),
		);
	}

	// Apply custom filters
	if (where?.query) {
		query = query.where("l.query", "=", where.query);
	}

	if (where?.lang) {
		query = query.where("l.lang", "=", where.lang);
	}

	if (where?.country) {
		query = query.where("l.country", "=", where.country);
	}

	if (where?.code) {
		query = query.where("l.code", "=", where.code);
	}

	if (where?.confidenceMin !== undefined) {
		query = query.where("l.confidence", ">=", where.confidenceMin);
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
					query = query.orderBy("l.confidence", sortItem.sort);
					break;
				case "query":
					query = query.orderBy("l.query", sortItem.sort);
					break;
				case "country":
					query = query.orderBy("l.country", sortItem.sort);
					break;
				case "address":
					query = query.orderBy("l.address", sortItem.sort);
					break;
			}
		}
	}

	return query;
};
