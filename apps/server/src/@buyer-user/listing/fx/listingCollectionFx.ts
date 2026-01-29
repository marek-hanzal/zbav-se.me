import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@buyer-user/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@buyer-user/listing/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/@buyer-user/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@buyer-user/listing/schema/ListingQuerySchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	userId,
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
				userId,
				meta,
			});
		},
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
