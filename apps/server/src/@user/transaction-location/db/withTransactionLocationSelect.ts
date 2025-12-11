import { sql } from "kysely";
import { match } from "ts-pattern";
import type { WithDatabase } from "~/database/WithDatabase";
import type { TransactionLocationSortSchema } from "../schema/TransactionLocationSortSchema";

export namespace withTransactionLocationSelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionLocationSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionLocationSelect>;
}

export const withTransactionLocationSelect = ({
	database,
	sort,
}: withTransactionLocationSelect.Props) => {
	let query = database
		.selectFrom("transaction_location as ltl")
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
