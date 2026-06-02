import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/seller/transaction/server/db/withTransactionSelectFx";
import type { TransactionCountQuerySchema } from "~/seller/transaction/server/schema/TransactionCountQuerySchema";
import type { TransactionWhereSchema } from "../schema/TransactionWhereSchema";

export namespace transactionCountFx {
	export interface Props extends TransactionCountQuerySchema.Type {
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionCountFx = Effect.fn("transactionCountFx")(function* ({
	where,
	scope,
}: transactionCountFx.Props) {
	const logger = yield* getLoggerFx("transactionCountFx");
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
