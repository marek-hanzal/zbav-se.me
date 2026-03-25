import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/server/@buyer/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/server/@buyer/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/server/@buyer/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/server/@buyer/listing/schema/ListingQuerySchema";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
	meta,
}: listingFetchFx.Props) {
	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			userId,
			sort,
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId,
				meta,
			});
		},
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
