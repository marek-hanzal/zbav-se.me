import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingIgnoreQueryBuilder } from "../db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "../db/withListingIgnoreSelect";
import type { ListingIgnoreQuerySchema } from "../schema/ListingIgnoreQuerySchema";
import { ListingIgnoreSchema } from "../schema/ListingIgnoreSchema";

export namespace listingIgnoreCollectionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingIgnoreQuerySchema.Type;
	}
}

export const listingIgnoreCollectionFx = ({
	database,
	userId,
	query: { cursor, filter, where, sort },
}: listingIgnoreCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
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
					userId,
				},
				query: withListingIgnoreQueryBuilder,
			});
		});
	});
};

export type listingIgnoreCollectionFx = ReturnType<typeof listingIgnoreCollectionFx>;
