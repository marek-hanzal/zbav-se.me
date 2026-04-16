import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionCollectionSelectFx } from "~/buyer/transaction/server/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/buyer/transaction/server/db/withTransactionQueryBuilderFx";
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
		selectFx: withTransactionCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCountFx = ReturnType<typeof transactionCountFx>;
