import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withListingEventCollectionSelectFx } from "~/buyer/listing-event/server/db/withListingEventCollectionSelectFx";
import { withListingEventQueryBuilderFx } from "~/buyer/listing-event/server/db/withListingEventQueryBuilderFx";
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
	filter,
	where,
	sort,
	scope,
}: listingEventCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingEventCollectionFx");
	logger.trace("listingEventCollectionFx", {
		cursor,
		filter,
		where,
		sort,
		scope,
	});

	return yield* withCollectionFx({
		selectFx: withListingEventCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCollectionFx = ReturnType<typeof listingEventCollectionFx>;
