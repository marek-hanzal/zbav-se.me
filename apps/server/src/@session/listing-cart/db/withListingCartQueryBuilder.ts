import type { ListingCartFilterSchema } from "../schema/ListingCartFilterSchema";
import type { withListingCartSelect } from "./withListingCartSelect";

export namespace withListingCartQueryBuilder {
	export interface Props {
		select: withListingCartSelect.Select;
		where?: ListingCartFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingCartSelect.Select;
}

/**
 * Standalone query builder that applies all filters from ListingCartQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingCartQueryBuilder: withListingCartQueryBuilder.Callback =
	({ select, where }) => {
		if (!where) {
			return select;
		}
		let query = select;

		if (where.id) {
			query = query.where("lc.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("lc.id", "in", where.idIn);
		}

		if (where.userId) {
			query = query.where("lc.userId", "=", where.userId);
		}

		if (where.listingId) {
			query = query.where("lc.listingId", "=", where.listingId);
		}

		return query;
	};
