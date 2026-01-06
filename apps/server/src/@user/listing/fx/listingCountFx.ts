import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingQueryBuilder } from "~/@user/listing/db/withListingQueryBuilder";
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
		select: yield* withListingCollectionSelectFx({
			meta,
		}),
		filter,
		where,
		query(query) {
			return withListingQueryBuilder({
				...query,
				userId: user.id,
				meta,
			});
		},
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
