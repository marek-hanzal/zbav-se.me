import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@user/listing/db/withListingQueryBuilderFx";
import { withListingCollectionSelectFx } from "~/app/listing/db/withListingCollectionSelectFx";
import type { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<listingCollectionFx>, UserContextFx>>;
