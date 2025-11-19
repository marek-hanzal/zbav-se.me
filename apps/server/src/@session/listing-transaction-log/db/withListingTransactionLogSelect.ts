import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { ListingTransactionLogSortSchema } from "../schema/ListingTransactionLogSortSchema";

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
	let query = database.selectFrom("listing_transaction_log as ltl").select([
		"ltl.id",
		"ltl.listingTransactionId",
		"ltl.status",
		"ltl.side",
		"ltl.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltl.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
