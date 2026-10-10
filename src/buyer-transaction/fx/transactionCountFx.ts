import { Effect } from "effect";
import { withTransactionSelectFx } from "~/buyer-transaction/db/withTransactionSelectFx";
import type { TransactionCountQuerySchema } from "~/buyer-transaction/schema/TransactionCountQuerySchema";
import type { TransactionWhereSchema } from "~/buyer-transaction/schema/TransactionWhereSchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace transactionCountFx {
	export interface Props extends TransactionCountQuerySchema.Type {
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionCountFx = Effect.fn("transactionCountFx")(function* ({
	where,
	scope,
}: transactionCountFx.Props) {
	const logger = yield* getLoggerFx("transactionCountFx", "transaction");
	logger.trace("transactionCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionSelectFx({}),
		where,
		scope,
	});
});

export type transactionCountFx = ReturnType<typeof transactionCountFx>;
