import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingEventQueryBuilder } from "~/app/listing-event/db/withListingEventQueryBuilder";
import { withListingEventSelect } from "~/app/listing-event/db/withListingEventSelect";
import type { ListingEventQuerySchema } from "~/app/listing-event/schema/ListingEventQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { ListingEventSchema } from "../schema/ListingEventSchema";

export namespace listingEventCollectionFx {
	export type Props = ListingEventQuerySchema.Type;
}

export const listingEventCollectionFx = (query: listingEventCollectionFx.Props) => {
	const { cursor, filter, where, sort } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingEventSelect({
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
	});
};

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
