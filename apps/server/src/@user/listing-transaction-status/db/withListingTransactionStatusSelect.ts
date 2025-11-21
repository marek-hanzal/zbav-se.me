import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { ListingTransactionStatusSortSchema } from "../schema/ListingTransactionStatusSortSchema";

export namespace withListingTransactionStatusSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionStatusSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionStatusSelect>;
}

export const withListingTransactionStatusSelect = ({
	database,
	sort,
}: withListingTransactionStatusSelect.Props) => {
	let query = database.selectFrom("listing_transaction_status as lts").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
