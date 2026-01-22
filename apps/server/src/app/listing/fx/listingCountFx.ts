import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@session/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@session/listing/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/@session/listing/schema/ListingFilterSchema";
import type { ListingCountQuerySchema } from "~/app/listing/schema/ListingCountQuerySchema";

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
