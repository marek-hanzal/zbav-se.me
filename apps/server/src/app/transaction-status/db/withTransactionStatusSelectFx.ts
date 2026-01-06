import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionStatusSortSchema } from "~/app/transaction-status/schema/TransactionStatusSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withTransactionStatusSelectFx {
	export interface Props {
		sort?: TransactionStatusSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionStatusSelectFx>>;
}

export const withTransactionStatusSelectFx = Effect.fn("withTransactionStatusSelectFx")(function* ({
	sort,
}: withTransactionStatusSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("transaction_status as lts").selectAll();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
