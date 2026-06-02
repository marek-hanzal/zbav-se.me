import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/buyer/transaction/server/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import type { TransactionWhereSchema } from "../schema/TransactionWhereSchema";

export namespace transactionFetchFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionFetchFx = Effect.fn("transactionFetchFx")(function* ({
	where,
	scope,
	sort,
}: transactionFetchFx.Props) {
	const logger = yield* getLoggerFx("transactionFetchFx", "transaction");
	logger.trace("transactionFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "transaction",
		selectFx: withTransactionSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
