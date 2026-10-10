import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionAcceptFn } from "~/seller-transaction/fn/transactionAcceptFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionAcceptMutation = withMutationFn<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionAcceptFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionAcceptMutation",
	]),
	keysFn() {
		return [
			"seller",
			"transaction",
			"accept",
		];
	},
	async mutationFn(variables) {
		return transactionAcceptFn({
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
