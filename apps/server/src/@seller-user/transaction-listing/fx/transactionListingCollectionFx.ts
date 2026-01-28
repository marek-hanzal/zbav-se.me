import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionListingCollectionSelectFx } from "~/@seller-user/transaction-listing/db/withTransactionListingCollectionSelectFx";
import { withTransactionListingQueryBuilderFx } from "~/@seller-user/transaction-listing/db/withTransactionListingQueryBuilderFx";
import type { TransactionListingFilterSchema } from "~/@seller-user/transaction-listing/schema/TransactionListingFilterSchema";
import type { TransactionListingQuerySchema } from "~/@seller-user/transaction-listing/schema/TransactionListingQuerySchema";

export namespace transactionListingCollectionFx {
	export interface Props extends TransactionListingQuerySchema.Type {
		scope?: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingCollectionFx = Effect.fn("transactionListingCollectionFx")(
	function* ({ filter, where, scope, cursor, sort }: transactionListingCollectionFx.Props) {
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
