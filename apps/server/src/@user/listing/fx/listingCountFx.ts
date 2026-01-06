import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/app/listing/db/withListingCollectionSelectFx";
import { withListingQueryBuilder } from "~/app/listing/db/withListingQueryBuilder";
import type { ListingCountQuerySchema } from "~/app/listing/schema/ListingCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingCountFx {
	export type Props = ListingCountQuerySchema.Type;
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	meta,
}: listingCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withListingCollectionSelectFx({
			database,
			sort: undefined,
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
