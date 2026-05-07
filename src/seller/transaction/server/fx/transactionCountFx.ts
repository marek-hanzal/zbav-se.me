import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/seller/transaction/server/db/withTransactionSelectFx";
import type { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";

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
	const logger = yield* getLoggerFx("transactionCountFx");
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
