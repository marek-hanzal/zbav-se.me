import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withListingSelectFx } from "~/seller-listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/seller-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	userId,
	where,
	scope,
	sort,
}: listingFetchFx.Props) {
	const logger = yield* getLoggerFx("listingFetchFx");
	logger.trace("listingFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			userId,
			sort,
		}),
		where,
		scope,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
