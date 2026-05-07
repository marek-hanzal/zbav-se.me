import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionEntrySelectFx } from "../db/withTransactionEntrySelectFx";
import type { TransactionEntryCountQuerySchema } from "../schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryFilterSchema } from "../schema/TransactionEntryFilterSchema";

export namespace transactionEntryCountFx {
	export interface Props extends TransactionEntryCountQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryCountFx = Effect.fn("transactionEntryCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
}: transactionEntryCountFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryCountFx", "transaction-entry");
	logger.trace("transactionEntryCountFx", {
		userId,
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionEntrySelectFx({
			userId,
		}),
		filter,
		where,
		scope,
	});
});

export type transactionEntryCountFx = ReturnType<typeof transactionEntryCountFx>;
