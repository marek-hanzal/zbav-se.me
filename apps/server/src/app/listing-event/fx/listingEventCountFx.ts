import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/app/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/app/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventCountQuerySchema } from "~/app/listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/app/listing-event/schema/ListingEventFilterSchema";

export namespace listingEventCountFx {
	export interface Props extends ListingEventCountQuerySchema.Type {
		scope: ListingEventFilterSchema.Type;
	}
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	filter,
	where,
	scope,
}: listingEventCountFx.Props) {
	return yield* withCountFx({
		selectFx: withListingEventCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
