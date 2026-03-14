import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@seller/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@seller/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/@seller/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@seller/listing/schema/ListingQuerySchema";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: listingFetchFx.Props) {
	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withListingQueryBuilderFx,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
