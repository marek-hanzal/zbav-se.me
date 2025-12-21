import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingCollectionSelect } from "~/app/listing/db/withListingCollectionSelect";
import { withListingQueryBuilder } from "~/app/listing/db/withListingQueryBuilder";
import type { ListingCountQuerySchema } from "~/app/listing/schema/ListingCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingCountFx {
	export type Props = ListingCountQuerySchema.Type;
}

export const listingCountFx = (query: listingCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const { filter, where, meta } = query;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingCollectionSelect({
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
	});
};

export type listingCountFx = ReturnType<typeof listingCountFx>;
