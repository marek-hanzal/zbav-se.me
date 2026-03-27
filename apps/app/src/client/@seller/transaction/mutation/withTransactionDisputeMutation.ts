import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionDisputeFn } from "~/client/@seller/transaction/server/fn/transactionDisputeFn";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";
import { withTransactionListingQuery } from "~/client/@seller/transaction-listing/query/withTransactionListingQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionDisputeMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"seller",
			"transaction",
			"dispute",
		];
	},
	async mutationFn(variables) {
		return transactionDisputeFn({
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
