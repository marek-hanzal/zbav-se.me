import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/@buyer-session/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/@buyer-session/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventFilterSchema } from "~/@buyer-session/listing-event/schema/ListingEventFilterSchema";
import type { ListingEventQuerySchema } from "~/@buyer-session/listing-event/schema/ListingEventQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingEventCollectionFx",
		input: {
			cursor,
			filter,
			where,
			sort,
			scope,
		},
	});

	return yield* withCollectionFx({
		selectFx: withListingEventCollectionSelectFx({
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
