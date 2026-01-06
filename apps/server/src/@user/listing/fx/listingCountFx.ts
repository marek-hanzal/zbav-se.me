import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@user/listing/db/withListingQueryBuilderFx";
import { withListingCollectionSelectFx } from "~/app/listing/db/withListingCollectionSelectFx";
import type { ListingCountQuerySchema } from "~/app/listing/schema/ListingCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace listingCountFx {
	export type Props = ListingCountQuerySchema.Type;
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	meta,
}: listingCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
			meta,
		}),
		filter,
		where,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId: user.id,
				meta,
			});
		},
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
