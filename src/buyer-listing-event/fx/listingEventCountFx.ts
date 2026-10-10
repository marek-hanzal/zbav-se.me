import { Effect } from "effect";
import { withListingEventSelectFx } from "~/buyer-listing-event/db/withListingEventSelectFx";
import type { ListingEventCountQuerySchema } from "~/buyer-listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventWhereSchema } from "~/buyer-listing-event/schema/ListingEventWhereSchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingEventCountFx {
	export interface Props extends ListingEventCountQuerySchema.Type {
		scope: ListingEventWhereSchema.Type;
	}
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	where,
	scope,
}: listingEventCountFx.Props) {
	const logger = yield* getLoggerFx("listingEventCountFx");
	logger.trace("listingEventCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withListingEventSelectFx({}),
		where,
		scope,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
