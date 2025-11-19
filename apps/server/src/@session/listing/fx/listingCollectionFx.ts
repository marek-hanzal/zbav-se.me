import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingQuerySchema } from "../schema/ListingQuerySchema";
import { ListingSchema } from "../schema/ListingSchema";

export namespace listingCollectionFx {
	export interface Props {
		query: ListingQuerySchema.Type;
	}
}

export const listingCollectionFx = ({
	query: { cursor, filter, where, sort, meta },
}: listingCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingSelect({
					database,
					sort,
					meta,
					userId: user.id,
				}),
				output: ListingSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query(query) {
					return withListingQueryBuilder({
						...query,
						userId: user.id,
					});
				},
			});
		});
	});
};

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
