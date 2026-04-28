import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withListingSelectFx } from "~/seller/listing/server/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";

export namespace listingFetchFx {
	export interface Scope extends ListingFilterSchema.Type {
		userId: string;
	}

	export interface Props extends ListingQuerySchema.Type {
		scope: Scope;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: listingFetchFx.Props) {
	const logger = yield* getLoggerFx("listingFetchFx");
	logger.trace("listingFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
