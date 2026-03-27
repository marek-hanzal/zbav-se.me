import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/server/@public/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/server/@public/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/server/@public/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/server/@public/listing/schema/ListingQuerySchema";

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
	meta,
}: listingFetchFx.Props) {
	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			sort,
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				meta,
			});
		},
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
