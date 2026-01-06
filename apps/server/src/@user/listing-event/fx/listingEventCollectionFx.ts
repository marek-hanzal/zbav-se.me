import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingEventQueryBuilder } from "~/app/listing-event/db/withListingEventQueryBuilder";
import { withListingEventSelectFx } from "~/app/listing-event/db/withListingEventSelectFx";
import type { ListingEventQuerySchema } from "~/app/listing-event/schema/ListingEventQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	const database = yield* DatabaseContextFx;

	return yield* withCollectionFx({
		select: yield* withListingEventSelectFx({
			database,
			sort,
		}),
		output: ListingEventSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		query: withListingEventQueryBuilder,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
