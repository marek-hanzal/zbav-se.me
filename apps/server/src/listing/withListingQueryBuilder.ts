import { withLikeEx } from "../database/expression/withLikeEx";
import type { ListingFilterSchema } from "./schema/ListingFilterSchema";
import type { withListingSelect } from "./withListingSelect";

export namespace withListingQueryBuilder {
	export interface Props {
		select: withListingSelect.Select;
		where?: ListingFilterSchema.Type;
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
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("l.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn);
	}

	if (where.fulltext) {
		const fulltext = where.fulltext;

		query = query.where((eb) =>
			eb.or([
				withLikeEx(eb.ref("l.vendor"), fulltext),
				withLikeEx(eb.ref("l.model"), fulltext),
				withLikeEx(eb.ref("cat.category"), fulltext),
				withLikeEx(eb.ref("cat.group"), fulltext),
			]),
		);
	}

	if (where.priceMin !== undefined) {
		query = query.where("l.price", ">=", where.priceMin);
	}

	if (where.priceMax !== undefined) {
		query = query.where("l.price", "<=", where.priceMax);
	}

	if (where.conditionMin !== undefined) {
		query = query.where("l.condition", ">=", where.conditionMin);
	}

	if (where.conditionMax !== undefined) {
		query = query.where("l.condition", "<=", where.conditionMax);
	}

	if (where.conditionIn && where.conditionIn.length > 0) {
		query = query.where("l.condition", "in", where.conditionIn);
	}

	if (where.ageMin !== undefined) {
		query = query.where("l.age", ">=", where.ageMin);
	}

	if (where.ageMax !== undefined) {
		query = query.where("l.age", "<=", where.ageMax);
	}

	if (where.locationId) {
		query = query.where("l.locationId", "=", where.locationId);
	}

	if (where.locationIdIn && where.locationIdIn.length > 0) {
		query = query.where("l.locationId", "in", where.locationIdIn);
	}

	if (where.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId);
	}

	if (where.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn);
	}

	if (where.vendor) {
		query = query.where((eb) =>
			withLikeEx(eb.ref("l.vendor"), where.vendor),
		);
	}

	if (where.model) {
		query = query.where((eb) => withLikeEx(eb.ref("l.model"), where.model));
	}

	return query;
};
