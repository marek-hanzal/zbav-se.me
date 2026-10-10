import { Effect } from "effect";
import { withListingEventSelectFx } from "~/buyer/listing-event/server/db/withListingEventSelectFx";
import type { ListingEventQuerySchema } from "~/buyer/listing-event/server/schema/ListingEventQuerySchema";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { ListingEventWhereSchema } from "../schema/ListingEventWhereSchema";

export namespace listingEventCollectionFx {
	export interface Props extends ListingEventQuerySchema.Type {
		scope: ListingEventWhereSchema.Type;
	}
}

export const listingEventCollectionFx = Effect.fn("listingEventCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	where,
	sort,
	scope,
}: listingEventCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingEventCollectionFx");
	logger.trace("listingEventCollectionFx", {
		cursor,
		limit,
		where,
		sort,
		scope,
	});

	return yield* withCollectionFx({
		selectFx: withListingEventSelectFx({
			sort,
		}),
		cursor,
		limit,
		where,
		scope,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
