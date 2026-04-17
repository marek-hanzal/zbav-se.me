import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { transactionRejectFn } from "~/buyer/transaction/fn/transactionRejectFn";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionRejectMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionRejectMutation",
	]),
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
