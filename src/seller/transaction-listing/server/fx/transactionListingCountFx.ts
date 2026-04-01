import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionListingQueryBuilderFx } from "~/seller/transaction-listing/server/db/withTransactionListingQueryBuilderFx";
import { withTransactionListingSourceSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingSourceSelectFx";
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
	logger.debug("transactionListingCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withTransactionListingSourceSelectFx(),
		filter,
		where,
		scope,
		queryFx: withTransactionListingQueryBuilderFx,
	});
});

export type transactionListingCountFx = ReturnType<typeof transactionListingCountFx>;
