import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingCartQueryBuilder } from "../db/withListingCartQueryBuilder";
import { withListingCartSelect } from "../db/withListingCartSelect";
import type { ListingCartQuerySchema } from "../schema/ListingCartQuerySchema";
import { ListingCartSchema } from "../schema/ListingCartSchema";

export namespace listingCartCollectionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingCartQuerySchema.Type;
	}
}

export const listingCartCollectionFx = ({
	database,
	userId,
	query: { cursor, filter, where, sort },
}: listingCartCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingCartSelect({
					database,
					sort,
				}),
				output: ListingCartSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingCartQueryBuilder,
			});
		});
	});
};

export type listingCartCollectionFx = ReturnType<typeof listingCartCollectionFx>;
