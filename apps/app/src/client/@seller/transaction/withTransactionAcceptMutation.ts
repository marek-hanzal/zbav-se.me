import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { withTransactionListingQuery } from "~/client/@seller/transaction-listing/withTransactionListingQuery";
import { transactionAcceptFn } from "~/server/@seller/transaction/fn/transactionAcceptFn";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
import { withTransactionQuery } from "./withTransactionQuery";

export const withTransactionAcceptMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"seller",
			"transaction",
			"accept",
		];
	},
	async mutationFn(variables) {
		return transactionAcceptFn({
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
