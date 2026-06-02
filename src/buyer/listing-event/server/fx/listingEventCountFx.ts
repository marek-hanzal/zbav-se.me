import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withListingEventSelectFx } from "~/buyer/listing-event/server/db/withListingEventSelectFx";
import type { ListingEventCountQuerySchema } from "~/buyer/listing-event/server/schema/ListingEventCountQuerySchema";
import type { ListingEventWhereSchema } from "../schema/ListingEventWhereSchema";

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
