import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionListingCollectionSelectFx } from "~/server/@seller/transaction-listing/db/withTransactionListingCollectionSelectFx";
import { withTransactionListingQueryBuilderFx } from "~/server/@seller/transaction-listing/db/withTransactionListingQueryBuilderFx";
import type { TransactionListingFilterSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingFilterSchema";
import type { TransactionListingQuerySchema } from "~/server/@seller/transaction-listing/schema/TransactionListingQuerySchema";

export namespace transactionListingCollectionFx {
	export interface Props extends TransactionListingQuerySchema.Type {
		scope: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingCollectionFx = Effect.fn("transactionListingCollectionFx")(
	function* ({ cursor, filter, where, scope, sort }: transactionListingCollectionFx.Props) {
		return yield* withCollectionFx({
			selectFx: withTransactionListingCollectionSelectFx({
				sort,
			}),
			cursor: cursor ?? {
				page: 0,
				size: 10,
			},
			filter,
			where,
			scope,
			queryFx: withTransactionListingQueryBuilderFx,
		});
	},
);

export type transactionListingCollectionFx = ReturnType<typeof transactionListingCollectionFx>;
