import { transactionSuccessFn } from "~/buyer/transaction/fn/transactionSuccessFn";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { withMutation } from "~/mutation/fn/withMutation";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
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
