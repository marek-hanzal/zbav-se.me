import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/public/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/public/listing/server/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";

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
	meta,
}: listingCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withListingCollectionSelectFx({
			sort,
			meta,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
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

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
