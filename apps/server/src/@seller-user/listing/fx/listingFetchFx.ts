import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTraceFx } from "~/effect/withTraceFx";
import { withListingQueryBuilderFx } from "~/@seller-user/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@seller-user/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/@seller-user/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@seller-user/listing/schema/ListingQuerySchema";

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
	yield* withTraceFx({
		fx: "listingFetchFx",
		input: { filter, where, scope, sort },
	});

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
