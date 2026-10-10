import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withTransactionEntrySelectFx } from "~/user-transaction-entry/db/withTransactionEntrySelectFx";
import type { TransactionEntryCountQuerySchema } from "~/user-transaction-entry/schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryWhereSchema } from "~/user-transaction-entry/schema/TransactionEntryWhereSchema";

export namespace transactionEntryCountFx {
	export interface Props extends TransactionEntryCountQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryWhereSchema.Type;
	}
}

export const transactionEntryCountFx = Effect.fn("transactionEntryCountFx")(function* ({
	userId,
	where,
	scope,
}: transactionEntryCountFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryCountFx", "transaction-entry");
	logger.trace("transactionEntryCountFx", {
		userId,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionEntrySelectFx({
			userId,
		}),
		where,
		scope,
	});
});

export type transactionEntryCountFx = ReturnType<typeof transactionEntryCountFx>;
