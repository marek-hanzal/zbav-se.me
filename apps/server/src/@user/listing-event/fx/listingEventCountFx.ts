import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventQueryBuilderFx } from "~/app/listing-event/db/withListingEventQueryBuilderFx";
import { withListingEventSelectFx } from "~/app/listing-event/db/withListingEventSelectFx";
import type { ListingEventCountQuerySchema } from "~/app/listing-event/schema/ListingEventCountQuerySchema";

export namespace listingEventCountFx {
	export type Props = ListingEventCountQuerySchema.Type;
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	filter,
	where,
}: listingEventCountFx.Props) {
	return yield* withCountFx({
		selectFx: withListingEventSelectFx({}),
		filter,
		where,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
