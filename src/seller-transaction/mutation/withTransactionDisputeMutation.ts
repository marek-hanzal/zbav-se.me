import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionDisputeFn } from "~/seller-transaction/fn/transactionDisputeFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionDisputeMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionDisputeFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionDisputeMutation",
	]),
	keys() {
		return [
			"seller",
			"transaction",
			"dispute",
		];
	},
	async mutationFn(variables) {
		return transactionDisputeFn({
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
					withListingQuery.invalidator(queryClient, [
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
