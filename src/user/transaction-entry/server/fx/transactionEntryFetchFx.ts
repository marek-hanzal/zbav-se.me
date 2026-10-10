import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withTransactionEntrySelectFx } from "~/user/transaction-entry/server/db/withTransactionEntrySelectFx";
import type { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";
import type { TransactionEntryWhereSchema } from "../schema/TransactionEntryWhereSchema";

export namespace transactionEntryFetchFx {
	export interface Props extends TransactionEntryQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryWhereSchema.Type;
	}
}

export const transactionEntryFetchFx = Effect.fn("transactionEntryFetchFx")(function* ({
	userId,
	where,
	scope,
	sort,
}: transactionEntryFetchFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryFetchFx", "transaction-entry");
	logger.trace("transactionEntryFetchFx", {
		userId,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "transaction-entry",
		selectFx: withTransactionEntrySelectFx({
			userId,
			sort,
		}),
		where,
		scope,
	});
});

export type transactionEntryFetchFx = ReturnType<typeof transactionEntryFetchFx>;
