import { withCollection } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withListingCollectionSelect } from "~/app/listing/db/withListingCollectionSelect";
import { withListingQueryBuilder } from "~/app/listing/db/withListingQueryBuilder";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingCollectionFx {
	export type Props = ListingQuerySchema.Type;
}

export const listingCollectionFx = (query: listingCollectionFx.Props) => {
	const { cursor, filter, where, sort, meta } = query;
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingCollectionSelect({
					database,
					sort,
					meta,
				}),
				output: EntitySchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingQueryBuilder,
			});
		});
	});
};

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
