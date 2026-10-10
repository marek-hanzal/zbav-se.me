import { transactionSuccessFn } from "~/buyer-transaction/fn/transactionSuccessFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

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
				await Promise.all([
					withTransactionQuery.invalidator(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
					withActivityQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
