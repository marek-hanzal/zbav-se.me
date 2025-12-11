import type { ListingScoreFilterSchema } from "~/app/listing-score/schema/ListingScoreFilterSchema";
import type { withListingScoreSelect } from "./withListingScoreSelect";

export namespace withListingScoreQueryBuilder {
	export interface Props {
		select: withListingScoreSelect.Select;
		where?: ListingScoreFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingScoreSelect.Select;
}

/**
 * Standalone query builder that applies all filters from ListingScoreQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingScoreQueryBuilder: withListingScoreQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("ls.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("ls.id", "in", where.idIn);
	}

	if (where.userId) {
		query = query.where("ls.userId", "=", where.userId);
	}

	if (where.listingId) {
		query = query.where("ls.listingId", "=", where.listingId);
	}

	return query;
};
