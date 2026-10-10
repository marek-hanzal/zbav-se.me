import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionDisputeFn } from "~/seller-transaction/fn/transactionDisputeFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionDisputeMutation = withMutationFn<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionDisputeFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionDisputeMutation",
	]),
	keysFn() {
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
			async invalidateFn(queryClient) {
				await Promise.all([
					withTransactionQuery.invalidatorFn(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
					withListingQuery.invalidatorFn(queryClient, [
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
