import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/@buyer-user/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/@buyer-user/listing/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/@buyer-user/listing/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/@buyer-user/listing/schema/ListingFilterSchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingCountFx",
		input: {
			userId,
			filter,
			where,
			scope,
			meta,
		},
	});

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
