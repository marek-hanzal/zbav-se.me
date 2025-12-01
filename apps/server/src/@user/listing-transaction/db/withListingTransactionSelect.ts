import { match } from "ts-pattern";
import type { ListingTransactionSortSchema } from "~/@user/listing-transaction/schema/ListingTransactionSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingTransactionSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionSelect>;
}

export const withListingTransactionSelect = ({
	database,
	sort,
}: withListingTransactionSelect.Props) => {
	let query = database
		.selectFrom("listing_transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.selectAll("lt")
		.select("l.title");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
