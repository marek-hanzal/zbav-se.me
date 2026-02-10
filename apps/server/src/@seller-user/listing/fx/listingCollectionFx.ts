import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@seller-user/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@seller-user/listing/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/@seller-user/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@seller-user/listing/schema/ListingQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingCollectionFx",
		input: {
			cursor,
			filter,
			where,
			scope,
			sort,
		},
	});

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
