import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingFlagQueryBuilder } from "../db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "../db/withListingFlagSelect";
import type { ListingFlagQuerySchema } from "../schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "../schema/ListingFlagSchema";

export namespace listingFlagCollectionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingFlagQuerySchema.Type;
	}
}

export const listingFlagCollectionFx = ({
	database,
	userId,
	query: { cursor, filter, where, sort },
}: listingFlagCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingFlagSelect({
					database,
					sort,
				}),
				output: ListingFlagSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingFlagQueryBuilder,
			});
		});
	});
};

export type listingFlagCollectionFx = ReturnType<typeof listingFlagCollectionFx>;
