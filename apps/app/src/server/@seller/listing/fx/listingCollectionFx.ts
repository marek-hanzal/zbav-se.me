import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/server/@seller/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/server/@seller/listing/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/server/@seller/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/server/@seller/listing/schema/ListingQuerySchema";

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
