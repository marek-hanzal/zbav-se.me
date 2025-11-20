import type { ListingIgnoreFilterSchema } from "../schema/ListingIgnoreFilterSchema";
import type { withListingIgnoreSelect } from "./withListingIgnoreSelect";

export namespace withListingIgnoreQueryBuilder {
	export interface Props {
		select: withListingIgnoreSelect.Select;
		where?: ListingIgnoreFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingIgnoreSelect.Select;
}

/**
 * Standalone query builder that applies all filters from ListingIgnoreQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingIgnoreQueryBuilder: withListingIgnoreQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("li.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("li.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("li.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("li.listingId", "=", where.listingId);
	}

	return query;
};
