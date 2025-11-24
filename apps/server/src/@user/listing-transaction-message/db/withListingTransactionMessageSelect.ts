import { sql } from "kysely";
import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { ListingTransactionMessageSortSchema } from "../schema/ListingTransactionMessageSortSchema";

export namespace withListingTransactionMessageSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionMessageSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionMessageSelect>;
}

export const withListingTransactionMessageSelect = ({
	database,
	sort,
}: withListingTransactionMessageSelect.Props) => {
	let query = database
		.selectFrom("listing_transaction_message as ltm")
		.selectAll()
		.select(sql<"message">`'message'`.as("event"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltm.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
