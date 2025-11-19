import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingTransactionLogQueryBuilder } from "../db/withListingTransactionLogQueryBuilder";
import { withListingTransactionLogSelect } from "../db/withListingTransactionLogSelect";
import type { ListingTransactionLogQuerySchema } from "../schema/ListingTransactionLogQuerySchema";
import { ListingTransactionLogSchema } from "../schema/ListingTransactionLogSchema";

export namespace listingTransactionLogCollectionFx {
	export interface Props {
		database: WithDatabase;
		query: ListingTransactionLogQuerySchema.Type;
	}
}

export const listingTransactionLogCollectionFx = ({
	database,
	query: { cursor, filter, where, sort },
}: listingTransactionLogCollectionFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCollection({
				select: withListingTransactionLogSelect({
					database,
					sort,
				}),
				output: ListingTransactionLogSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where,
				query: withListingTransactionLogQueryBuilder,
			});
		});
	});
};

export type listingTransactionLogCollectionFx = ReturnType<
	typeof listingTransactionLogCollectionFx
>;
