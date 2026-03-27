import { Effect } from "effect";
import type { withListingEventSourceSelectFx } from "~/@buyer/listing-event/server/db/withListingEventSourceSelectFx";
import type { ListingEventFilterSchema } from "~/@buyer/listing-event/server/schema/ListingEventFilterSchema";

export namespace withListingEventQueryBuilderFx {
	export interface Props<
		TSelect extends
			withListingEventSourceSelectFx.Select = withListingEventSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: ListingEventFilterSchema.Type;
	}

	export type Callback = <TSelect extends withListingEventSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from ListingEventQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingEventQueryBuilderFx = Effect.fn("withListingEventQueryBuilderFx")(
	function* <TSelect extends withListingEventSourceSelectFx.Select>({
		select,
		where,
	}: withListingEventQueryBuilderFx.Props<TSelect>) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("le.id", "=", where.id) as TSelect;
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("le.id", "in", where.idIn) as TSelect;
		}

		if (where.listingId) {
			query = query.where("le.listingId", "=", where.listingId) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
