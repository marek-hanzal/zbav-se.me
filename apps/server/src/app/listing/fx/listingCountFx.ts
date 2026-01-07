import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/app/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/app/listing/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/app/listing/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
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

export type listingCountFx = ReturnType<typeof listingCountFx>;
