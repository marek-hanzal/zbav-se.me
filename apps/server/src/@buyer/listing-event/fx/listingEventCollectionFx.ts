import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/@buyer/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/@buyer/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventFilterSchema } from "~/@buyer/listing-event/schema/ListingEventFilterSchema";
import type { ListingEventQuerySchema } from "~/@buyer/listing-event/schema/ListingEventQuerySchema";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "listingEventCollectionFx",
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
