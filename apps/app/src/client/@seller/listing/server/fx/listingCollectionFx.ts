import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/client/@seller/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/client/@seller/listing/server/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/client/@seller/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/client/@seller/listing/server/schema/ListingQuerySchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: listingCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withListingCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withListingQueryBuilderFx,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
