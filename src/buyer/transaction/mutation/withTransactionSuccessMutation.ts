import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { transactionSuccessFn } from "~/buyer/transaction/fn/transactionSuccessFn";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionSuccessMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionSuccessFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionSuccessMutation",
	]),
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
