import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingScoreQueryBuilder } from "../db/withListingScoreQueryBuilder";
import { withListingScoreSelect } from "../db/withListingScoreSelect";
import type { ListingScoreQuerySchema } from "../schema/ListingScoreQuerySchema";
import { ListingScoreSchema } from "../schema/ListingScoreSchema";

export namespace listingScoreCollectionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingScoreQuerySchema.Type;
	}
}

export const listingScoreCollectionFx = ({
	database,
	userId,
	query: { cursor, filter, where, sort },
}: listingScoreCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
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
					userId,
				},
				query: withListingScoreQueryBuilder,
			});
		});
	});
};

export type listingScoreCollectionFx = ReturnType<typeof listingScoreCollectionFx>;
