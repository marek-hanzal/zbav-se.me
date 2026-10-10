import { transactionRejectFn } from "~/buyer-transaction/fn/transactionRejectFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionRejectMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionRejectFn.Error
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
