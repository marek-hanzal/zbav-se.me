import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import type { TransactionEntrySortSchema } from "~/user/transaction-entry/server/schema/TransactionEntrySortSchema";

export namespace withTransactionEntrySelectFx {
	export interface Props {
		userId: string;
		sort?: TransactionEntrySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionEntrySelectFx>>;
}

export const withTransactionEntrySelectFx = Effect.fn("withTransactionEntrySelectFx")(function* ({
	userId,
	sort,
}: withTransactionEntrySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("transaction_entry as te")
		.innerJoin("transaction as t", "t.id", "te.transactionId")
		.selectAll("te")
		.select("t.listingId")
		.select((eb) =>
			eb
				.case()
				.when("te.userId", "is", null)
				.then("system")
				.when("te.userId", "=", userId)
				.then("out")
				.else("in")
				.end()
				.$castTo<TransactionEntryDirectionEnumSchema.Type>()
				.as("direction"),
		)
		.$castTo<TransactionEntrySchema.Type>();

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("te.id", item.order))
			.with("createdAt", () => query.orderBy("te.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
