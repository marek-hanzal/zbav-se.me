import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { transactionDisputeFn } from "~/buyer/transaction/server/fn/transactionDisputeFn";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { withTransactionQuery } from "../query/withTransactionQuery";

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
