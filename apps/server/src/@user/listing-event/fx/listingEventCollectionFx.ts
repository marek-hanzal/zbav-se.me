import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingEventQueryBuilderFx } from "~/app/listing-event/db/withListingEventQueryBuilderFx";
import { withListingEventSelectFx } from "~/app/listing-event/db/withListingEventSelectFx";
import type { ListingEventQuerySchema } from "~/app/listing-event/schema/ListingEventQuerySchema";
import { ListingEventSchema } from "../schema/ListingEventSchema";

export namespace listingEventCollectionFx {
	export type Props = ListingEventQuerySchema.Type;
}

export const listingEventCollectionFx = Effect.fn("listingEventCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: listingEventCollectionFx.Props) {
	return yield* withCollectionFx({
		select: yield* withListingEventSelectFx({
			sort,
		}),
		output: ListingEventSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
