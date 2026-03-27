import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionCloseFn } from "~/client/@buyer/transaction/server/fn/transactionCloseFn";
import type { TransactionSchema } from "~/client/@buyer/transaction/server/schema/TransactionSchema";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionCloseMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"buyer",
			"transaction",
			"close",
		];
	},
	async mutationFn(variables) {
		return transactionCloseFn({
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
