import { transactionCloseFn } from "~/buyer-transaction/fn/transactionCloseFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionCloseMutation = withMutationFn<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionCloseFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionCloseMutation",
	]),
	keysFn() {
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
