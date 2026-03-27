import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionSuccessFn } from "~/server/@buyer/transaction/fn/transactionSuccessFn";
import type { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionSuccessMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"buyer",
			"transaction",
			"success",
		];
	},
	async mutationFn(variables) {
		return transactionSuccessFn({
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
