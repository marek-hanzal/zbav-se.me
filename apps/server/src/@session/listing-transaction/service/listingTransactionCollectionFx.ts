import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingTransactionQueryBuilder } from "../db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "../db/withListingTransactionSelect";
import type { ListingTransactionQuerySchema } from "../schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "../schema/ListingTransactionSchema";

export namespace listingTransactionCollectionFx {
	export interface Props {
		userId: string;
		query: ListingTransactionQuerySchema.Type;
	}
}

export const listingTransactionCollectionFx = ({
	userId,
	query: { filter, where, cursor, sort, meta },
}: listingTransactionCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingTransactionSelect({
					sort,
				}),
				output: ListingTransactionSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId,
				},
				query(query) {
					return withListingTransactionQueryBuilder({
						meta,
						...query,
					});
				},
			});
		});
	});
};

export type listingTransactionCollectionFx = ReturnType<typeof listingTransactionCollectionFx>;
