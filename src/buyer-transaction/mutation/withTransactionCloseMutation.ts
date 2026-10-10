import { transactionCloseFn } from "~/buyer-transaction/fn/transactionCloseFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionCloseMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionCloseFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionCloseMutation",
	]),
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
