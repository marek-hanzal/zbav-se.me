import { match } from "ts-pattern";
import type { TransactionSortSchema } from "~/app/transaction/schema/TransactionSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withTransactionCollectionSelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionCollectionSelect>;
}

export const withTransactionCollectionSelect = ({
	database,
	sort,
}: withTransactionCollectionSelect.Props) => {
	let query = database.selectFrom("transaction as lt").select("lt.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
