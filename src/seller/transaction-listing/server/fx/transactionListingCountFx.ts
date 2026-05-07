import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionListingSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingSelectFx";
import type { TransactionListingCountQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingCountQuerySchema";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";

export namespace transactionListingCountFx {
	export interface Props extends TransactionListingCountQuerySchema.Type {
		scope: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingCountFx = Effect.fn("transactionListingCountFx")(function* ({
	filter,
	where,
	scope,
}: transactionListingCountFx.Props) {
	const logger = yield* getLoggerFx("transactionListingCountFx");
	logger.trace("transactionListingCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionListingSelectFx({}),
		filter,
		where,
		scope,
	});
});

export type transactionListingCountFx = ReturnType<typeof transactionListingCountFx>;
