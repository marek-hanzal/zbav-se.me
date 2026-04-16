import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionListingCollectionSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingCollectionSelectFx";
import { withTransactionListingQueryBuilderFx } from "~/seller/transaction-listing/server/db/withTransactionListingQueryBuilderFx";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";
import type { TransactionListingQuerySchema } from "~/seller/transaction-listing/server/schema/TransactionListingQuerySchema";

export namespace transactionListingCollectionFx {
	export interface Props extends TransactionListingQuerySchema.Type {
		scope: TransactionListingFilterSchema.Type;
	}
}

export const transactionListingCollectionFx = Effect.fn("transactionListingCollectionFx")(
	function* ({
		cursor = {
			page: 0,
			size: 10,
		},
		limit,
		filter,
		where,
		scope,
		sort,
	}: transactionListingCollectionFx.Props) {
		const logger = yield* getLoggerFx("transactionListingCollectionFx");
		logger.trace("transactionListingCollectionFx", {
			cursor,
			limit,
			filter,
			where,
			scope,
			sort,
		});

		return yield* withCollectionFx({
			selectFx: withTransactionListingCollectionSelectFx({
				sort,
			}),
			cursor,
			limit,
			filter,
			where,
			scope,
			queryFx: withTransactionListingQueryBuilderFx,
		});
	},
);

export type transactionListingCollectionFx = ReturnType<typeof transactionListingCollectionFx>;
