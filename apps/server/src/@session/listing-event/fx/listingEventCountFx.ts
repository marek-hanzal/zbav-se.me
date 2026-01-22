import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/@session/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/@session/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventCountQuerySchema } from "~/@session/listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/@session/listing-event/schema/ListingEventFilterSchema";

export namespace listingEventCountFx {
	export interface Props extends ListingEventCountQuerySchema.Type {
		scope: ListingEventFilterSchema.Type;
	}
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: listingEventCountFx.Props) {
	return yield* withCountFx({
		selectFx: withListingEventCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
