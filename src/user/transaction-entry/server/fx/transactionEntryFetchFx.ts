import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionEntrySelectFx } from "~/user/transaction-entry/server/db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "~/user/transaction-entry/server/schema/TransactionEntryFilterSchema";
import type { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";

export namespace transactionEntryFetchFx {
	export interface Props extends TransactionEntryQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryFetchFx = Effect.fn("transactionEntryFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: transactionEntryFetchFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryFetchFx", "transaction-entry");
	logger.trace("transactionEntryFetchFx", {
		userId,
		filter,
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
		filter,
		where,
		scope,
	});
});

export type transactionEntryFetchFx = ReturnType<typeof transactionEntryFetchFx>;
