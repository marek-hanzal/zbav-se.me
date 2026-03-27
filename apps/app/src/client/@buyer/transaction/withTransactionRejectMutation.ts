import { withMutation } from "@use-pico/client/mutation";
import type { EntitySchema } from "@use-pico/common/schema";
import { transactionRejectFn } from "~/server/@buyer/transaction/fn/transactionRejectFn";
import type { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";
import { withTransactionQuery } from "./withTransactionQuery";

export const withTransactionRejectMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	keys() {
		return [
			"buyer",
			"transaction",
			"reject",
		];
	},
	async mutationFn(variables) {
		return transactionRejectFn({
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
