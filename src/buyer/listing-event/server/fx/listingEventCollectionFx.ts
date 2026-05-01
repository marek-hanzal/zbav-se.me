import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withListingEventSelectFx } from "~/buyer/listing-event/server/db/withListingEventSelectFx";
import type { ListingEventFilterSchema } from "~/buyer/listing-event/server/schema/ListingEventFilterSchema";
import type { ListingEventQuerySchema } from "~/buyer/listing-event/server/schema/ListingEventQuerySchema";

export namespace listingEventCollectionFx {
	export interface Props extends ListingEventQuerySchema.Type {
		scope: ListingEventFilterSchema.Type;
	}
}

export const listingEventCollectionFx = Effect.fn("listingEventCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	sort,
	scope,
}: listingEventCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingEventCollectionFx");
	logger.trace("listingEventCollectionFx", {
		cursor,
		limit,
		filter,
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
		filter,
		where,
		scope,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
