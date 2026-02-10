import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/@buyer-session/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/@buyer-session/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventCountQuerySchema } from "~/@buyer-session/listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/@buyer-session/listing-event/schema/ListingEventFilterSchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingEventCountFx",
		input: {
			filter,
			where,
			scope,
			count,
		},
	});

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
