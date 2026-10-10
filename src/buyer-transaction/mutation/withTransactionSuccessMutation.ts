import { transactionSuccessFn } from "~/buyer-transaction/fn/transactionSuccessFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionSuccessMutation = withMutationFn<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionSuccessFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionSuccessMutation",
	]),
	keysFn() {
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
			async invalidateFn(queryClient) {
				await Promise.all([
					withTransactionQuery.invalidatorFn(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
					withActivityQuery.invalidatorFn(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
