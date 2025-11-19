import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withListingIgnoreQueryBuilder } from "../db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "../db/withListingIgnoreSelect";
import type { ListingIgnoreQuerySchema } from "../schema/ListingIgnoreQuerySchema";
import { ListingIgnoreSchema } from "../schema/ListingIgnoreSchema";

export namespace listingIgnoreCollectionFx {
	export interface Props {
		query: ListingIgnoreQuerySchema.Type;
	}
}

export const listingIgnoreCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingIgnoreCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingIgnoreSelect({
					database,
					sort,
				}),
				output: ListingIgnoreSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingIgnoreQueryBuilder,
			});
		});
	});
};

export type listingIgnoreCollectionFx = ReturnType<typeof listingIgnoreCollectionFx>;
