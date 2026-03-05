import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventCollectionSelectFx } from "~/@buyer/listing-event/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/@buyer/listing-event/db/withListingEventQueryBuilderFx";
import type { ListingEventCountQuerySchema } from "~/@buyer/listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/@buyer/listing-event/schema/ListingEventFilterSchema";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "listingEventCountFx",
		input: {
			filter,
			where,
			scope,
		},
	});

	return yield* withCountFx({
		selectFx: withListingEventCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
