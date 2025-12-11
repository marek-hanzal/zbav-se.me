import { withLikeEx } from "~/database/expression/withLikeEx";
import type { LocationFilterSchema } from "../schema/LocationFilterSchema";
import type { withLocationSelect } from "./withLocationSelect";

export namespace withLocationQueryBuilder {
	export interface Props {
		select: withLocationSelect.Select;
		where?: LocationFilterSchema.Type;
	}

	export type Callback = (props: Props) => withLocationSelect.Select;
}

/**
 * Standalone query builder that applies all filters from LocationQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withLocationQueryBuilder: withLocationQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}

	let query = select;

	if (where.id) {
		query = query.where("loc.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("loc.id", "in", where.idIn);
	}

	if (where.fulltext) {
		const term = where.fulltext;
		query = query.where((eb) =>
			eb.or([
				withLikeEx(eb.ref("loc.query"), term),
				withLikeEx(eb.ref("loc.address"), term),
				withLikeEx(eb.ref("loc.country"), term),
				withLikeEx(eb.ref("loc.municipality"), term),
				withLikeEx(eb.ref("loc.state"), term),
				withLikeEx(eb.ref("loc.county"), term),
			]),
		);
	}

	if (where.query) {
		const value = where.query;
		query = query.where((eb) => {
			return eb.or([
				eb("loc.id", "=", value),
				eb("loc.query", "ilike", value),
			]);
		});
	}

	if (where.lang) {
		query = query.where("loc.lang", "=", where.lang);
	}

	if (where.country) {
		query = query.where("loc.country", "=", where.country);
	}

	if (where.code) {
		query = query.where("loc.code", "=", where.code);
	}

	if (where.confidenceMin !== undefined) {
		query = query.where("loc.confidence", ">=", where.confidenceMin);
	}

	return query;
};
