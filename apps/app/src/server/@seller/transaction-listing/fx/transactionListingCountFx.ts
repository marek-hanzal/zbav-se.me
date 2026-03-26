import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withTransactionListingQueryBuilderFx } from "~/server/@seller/transaction-listing/db/withTransactionListingQueryBuilderFx";
import { withTransactionListingSourceSelectFx } from "~/server/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import type { TransactionListingCountQuerySchema } from "~/server/@seller/transaction-listing/schema/TransactionListingCountQuerySchema";
import type { TransactionListingFilterSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingFilterSchema";

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
	return yield* withCountFx({
		selectFx: withTransactionListingSourceSelectFx(),
		filter,
		where,
		scope,
		queryFx: withTransactionListingQueryBuilderFx,
	});
});

export type transactionListingCountFx = ReturnType<typeof transactionListingCountFx>;
