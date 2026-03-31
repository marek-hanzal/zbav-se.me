import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { withListingQueryBuilderFx } from "~/buyer/listing/server/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/buyer/listing/server/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

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
