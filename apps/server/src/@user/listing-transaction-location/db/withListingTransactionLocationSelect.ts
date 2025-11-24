import { sql } from "kysely";
import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { ListingTransactionLocationSortSchema } from "../schema/ListingTransactionLocationSortSchema";

export namespace withListingTransactionLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionLocationSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionLocationSelect>;
}

export const withListingTransactionLocationSelect = ({
	database,
	sort,
}: withListingTransactionLocationSelect.Props) => {
	let query = database
		.selectFrom("listing_transaction_location as ltl")
		.selectAll()
		.select(sql<"location">`'location'`.as("event"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltl.createdAt", item.direction))
			.with("time", () => query.orderBy("ltl.time", item.direction))
			.exhaustive();
	}

	return query;
};
