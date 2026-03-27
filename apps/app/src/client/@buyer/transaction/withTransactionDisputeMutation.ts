import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionDisputeFn } from "~/server/@buyer/transaction/fn/transactionDisputeFn";
import type { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";
import { withTransactionQuery } from "./withTransactionQuery";

export const withTransactionDisputeMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"buyer",
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
				await withTransactionQuery.invalidator(queryClient, [
					"fetch",
					"collection",
					"count",
				]);
			},
		},
	],
});
