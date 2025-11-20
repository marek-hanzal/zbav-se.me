import { match } from "ts-pattern";
import type { ListingTransactionLogSortSchema } from "~/@user/listing-transaction-log/schema/ListingTransactionLogSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingTransactionLogSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionLogSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionLogSelect>;
}

export const withListingTransactionLogSelect = ({
	database,
	sort,
}: withListingTransactionLogSelect.Props) => {
	let query = database
		.selectFrom("listing_transaction_log as ltl")
		.leftJoin("listing_transaction as lt", "ltl.listingTransactionId", "lt.id")
		.leftJoin("listing as l", "lt.listingId", "l.id")
		.select([
			"ltl.id",
			"ltl.listingTransactionId",
			"ltl.status",
			"ltl.side",
			"ltl.createdAt",
			"lt.userId",
			"l.userId as listingUserId",
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltl.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
