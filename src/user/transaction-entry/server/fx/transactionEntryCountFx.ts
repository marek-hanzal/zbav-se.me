import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionEntrySelectFx } from "../db/withTransactionEntrySelectFx";
import type { TransactionEntryCountQuerySchema } from "../schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryWhereSchema } from "../schema/TransactionEntryWhereSchema";

export namespace transactionEntryCountFx {
	export interface Props extends TransactionEntryCountQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryWhereSchema.Type;
	}
}

export const transactionEntryCountFx = Effect.fn("transactionEntryCountFx")(function* ({
	userId,
	where,
	scope,
}: transactionEntryCountFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryCountFx", "transaction-entry");
	logger.trace("transactionEntryCountFx", {
		userId,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionEntrySelectFx({
			userId,
		}),
		where,
		scope,
	});
});

export type transactionEntryCountFx = ReturnType<typeof transactionEntryCountFx>;
