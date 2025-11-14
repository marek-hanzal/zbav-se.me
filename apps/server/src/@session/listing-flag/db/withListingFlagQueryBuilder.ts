import type { ListingFlagFilterSchema } from "../schema/ListingFlagFilterSchema";
import type { withListingFlagSelect } from "./withListingFlagSelect";

export namespace withListingFlagQueryBuilder {
	export interface Props {
		select: withListingFlagSelect.Select;
		where?: ListingFlagFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingFlagSelect.Select;
}

/**
 * Standalone query builder that applies all filters from ListingFlagQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingFlagQueryBuilder: withListingFlagQueryBuilder.Callback = ({ select, where }) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("lf.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("lf.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("lf.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("lf.listingId", "=", where.listingId);
	}

	return query;
};
