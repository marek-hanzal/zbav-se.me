import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withListingEventQueryBuilderFx } from "~/app/listing-event/db/withListingEventQueryBuilderFx";
import { withListingEventSelectFx } from "~/app/listing-event/db/withListingEventSelectFx";
import type { ListingEventFilterSchema } from "~/app/listing-event/schema/ListingEventFilterSchema";
import type { ListingEventQuerySchema } from "~/app/listing-event/schema/ListingEventQuerySchema";

export namespace listingEventCollectionFx {
	export interface Props extends ListingEventQuerySchema.Type {
		scope: ListingEventFilterSchema.Type;
	}
}

export const listingEventCollectionFx = Effect.fn("listingEventCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
	scope,
}: listingEventCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withListingEventSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;

