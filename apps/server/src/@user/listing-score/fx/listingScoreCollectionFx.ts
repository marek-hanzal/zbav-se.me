import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withListingScoreQueryBuilder } from "../db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "../db/withListingScoreSelect";
import type { ListingScoreQuerySchema } from "../schema/ListingScoreQuerySchema";
import { ListingScoreSchema } from "../schema/ListingScoreSchema";

export namespace listingScoreCollectionFx {
	export interface Props {
		query: ListingScoreQuerySchema.Type;
	}
}

export const listingScoreCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingScoreCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withListingScoreSelect({
					database,
					sort,
				}),
				output: ListingScoreSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingScoreQueryBuilder,
			});
		});
	});
};

export type listingScoreCollectionFx = ReturnType<typeof listingScoreCollectionFx>;
