import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionResolveFn } from "~/client/@seller/transaction/server/fn/transactionResolveFn";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";
import { withTransactionListingQuery } from "~/client/@seller/transaction-listing/query/withTransactionListingQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionResolveMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"seller",
			"transaction",
			"resolve",
		];
	},
	async mutationFn(variables) {
		return transactionResolveFn({
			data: variables,
		});
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await Promise.all([
					withTransactionQuery.invalidator(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
					withTransactionListingQuery.invalidator(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
