import { sql } from "kysely";
import { match } from "ts-pattern";
import type { TransactionStatusSortSchema } from "~/@user/transaction-status/schema/TransactionStatusSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withTransactionStatusSelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionStatusSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionStatusSelect>;
}

export const withTransactionStatusSelect = ({
	database,
	sort,
}: withTransactionStatusSelect.Props) => {
	let query = database
		.selectFrom("transaction_status as lts")
		.selectAll()
		.select(sql<"status">`'status'`.as("event"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
