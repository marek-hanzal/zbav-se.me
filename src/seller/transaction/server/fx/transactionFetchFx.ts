import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/seller/transaction/server/db/withTransactionSelectFx";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";

export namespace transactionFetchFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionFetchFx = Effect.fn("transactionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionFetchFx.Props) {
	const logger = yield* getLoggerFx("transactionFetchFx");
	logger.trace("transactionFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "transaction",
		selectFx: withTransactionSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
