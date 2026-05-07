import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/buyer/transaction/server/db/withTransactionSelectFx";
import type { TransactionCountQuerySchema } from "~/buyer/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionFilterSchema } from "~/buyer/transaction/server/schema/TransactionFilterSchema";

export namespace transactionCountFx {
	export interface Props extends TransactionCountQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCountFx = Effect.fn("transactionCountFx")(function* ({
	filter,
	where,
	scope,
}: transactionCountFx.Props) {
	const logger = yield* getLoggerFx("transactionCountFx", "transaction");
	logger.trace("transactionCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type transactionCountFx = ReturnType<typeof transactionCountFx>;
