import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withListingEventSelectFx } from "~/buyer/listing-event/server/db/withListingEventSelectFx";
import type { ListingEventCountQuerySchema } from "~/buyer/listing-event/server/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/buyer/listing-event/server/schema/ListingEventFilterSchema";

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
	const logger = yield* getLoggerFx("listingEventCountFx");
	logger.trace("listingEventCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withListingEventSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
