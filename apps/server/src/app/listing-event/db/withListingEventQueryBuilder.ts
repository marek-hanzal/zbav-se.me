import type { ListingEventFilterSchema } from "~/app/listing-event/schema/ListingEventFilterSchema";
import type { withListingEventSelectFx } from "./withListingEventSelectFx";

export namespace withListingEventQueryBuilder {
	export interface Props {
		select: withListingEventSelectFx.Select;
		where?: ListingEventFilterSchema.Type;
	}

	export type Callback = (props: Props) => withListingEventSelectFx.Select;
}

/**
 * Standalone query builder that applies all filters from ListingEventQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingEventQueryBuilder: withListingEventQueryBuilder.Callback = ({
	select,
	where,
}) => {
	if (!where) {
		return select;
	}
	let query = select;

	if (where.id) {
		query = query.where("le.id", "=", where.id);
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("le.id", "in", where.idIn);
	}

	if (where.listingId) {
		query = query.where("le.listingId", "=", where.listingId);
	}

	return query;
};
