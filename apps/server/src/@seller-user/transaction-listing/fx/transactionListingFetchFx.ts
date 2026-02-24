import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionListingQueryBuilderFx } from "~/@seller-user/transaction-listing/db/withTransactionListingQueryBuilderFx";
import { withTransactionListingSelectFx } from "~/@seller-user/transaction-listing/db/withTransactionListingSelectFx";
import type { TransactionListingFilterSchema } from "~/@seller-user/transaction-listing/schema/TransactionListingFilterSchema";
import type { TransactionListingQuerySchema } from "~/@seller-user/transaction-listing/schema/TransactionListingQuerySchema";

export namespace transactionListingFetchFx {
	export interface Props extends TransactionListingQuerySchema.Type {
		scope?: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingFetchFx = Effect.fn("transactionListingFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionListingFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction-listing",
		selectFx: withTransactionListingSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withTransactionListingQueryBuilderFx,
	});
});

export type transactionListingFetchFx = ReturnType<typeof transactionListingFetchFx>;
