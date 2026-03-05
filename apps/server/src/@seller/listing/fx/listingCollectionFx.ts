import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@seller/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@seller/listing/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/@seller/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@seller/listing/schema/ListingQuerySchema";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "listingCollectionFx",
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
