import { Effect } from "effect";
import { withTransactionSelectFx } from "~/buyer-transaction/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/buyer-transaction/schema/TransactionQuerySchema";
import type { TransactionWhereSchema } from "~/buyer-transaction/schema/TransactionWhereSchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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
