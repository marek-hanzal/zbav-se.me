import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionEntrySortSchema } from "~/@user/transaction-entry/schema/TransactionEntrySortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withTransactionEntrySelectFx {
	export interface Props {
		sort?: TransactionEntrySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionEntrySelectFx>>;
}

export const withTransactionEntrySelectFx = Effect.fn("withTransactionEntrySelectFx")(function* ({
	sort,
}: withTransactionEntrySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("transaction_entry as te").select([
		"te.id",
		"te.transactionId",
		"te.kind",
		"te.userId",
		"te.payload",
		"te.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("te.id", item.order))
			.with("createdAt", () => query.orderBy("te.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
