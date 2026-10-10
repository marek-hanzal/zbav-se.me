import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionRejectFn } from "~/seller-transaction/fn/transactionRejectFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionRejectMutation = withMutationFn<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionRejectFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionRejectMutation",
	]),
	keysFn() {
		return [
			"seller",
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
