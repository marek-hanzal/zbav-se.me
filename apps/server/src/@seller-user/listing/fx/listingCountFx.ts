import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@seller-user/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@seller-user/listing/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/@seller-user/listing/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/@seller-user/listing/schema/ListingFilterSchema";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	scope,
	count,
}: listingCountFx.Props) {
	yield* withTraceFx({
		fx: "listingCountFx",
		input: {
			filter,
			where,
			scope,
			count,
		},
	});

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({}),
		filter,
		where,
		scope,
		count,
		queryFx: withListingQueryBuilderFx,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
