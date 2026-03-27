import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { withTransactionListingQuery } from "~/client/@seller/transaction-listing/withTransactionListingQuery";
import { transactionResolveFn } from "~/server/@seller/transaction/fn/transactionResolveFn";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
import { withTransactionQuery } from "./withTransactionQuery";

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
