import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withListingTransactionLogSelect } from "~/@user/listing-transaction-log/db/withListingTransactionLogSelect";
import type { ListingTransactionLogQuerySchema } from "~/@user/listing-transaction-log/schema/ListingTransactionLogQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

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
		const user = yield* UserContextFx;

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
				where: {
					...where,
					userId: user.id,
				},
				query: withListingTransactionLogQueryBuilder,
			});
		});
	});
};

export type listingTransactionLogCollectionFx = ReturnType<
	typeof listingTransactionLogCollectionFx
>;
