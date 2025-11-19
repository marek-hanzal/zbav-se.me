import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withListingTransactionLogQueryBuilder } from "../db/withListingTransactionLogQueryBuilder";
import { withListingTransactionLogSelect } from "../db/withListingTransactionLogSelect";
import type { ListingTransactionLogQuerySchema } from "../schema/ListingTransactionLogQuerySchema";
import { ListingTransactionLogSchema } from "../schema/ListingTransactionLogSchema";

export namespace listingTransactionLogCollectionFx {
	export interface Props {
		query: ListingTransactionLogQuerySchema.Type;
	}
}

export const listingTransactionLogCollectionFx = ({
	query: { cursor, filter, where, sort },
}: listingTransactionLogCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.tryPromise(async () => {
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
