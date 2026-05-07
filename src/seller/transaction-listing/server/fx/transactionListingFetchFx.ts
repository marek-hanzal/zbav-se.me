import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionListingSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingSelectFx";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";
import type { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";

export namespace transactionListingFetchFx {
	export interface Props extends TransactionListingQuerySchema.Type {
		scope: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingFetchFx = Effect.fn("transactionListingFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionListingFetchFx.Props) {
	const logger = yield* getLoggerFx("transactionListingFetchFx");
	logger.trace("transactionListingFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "transaction-listing",
		selectFx: withTransactionListingSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type transactionListingFetchFx = ReturnType<typeof transactionListingFetchFx>;
