import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionAcceptFn } from "~/seller-transaction/fn/transactionAcceptFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export const withTransactionAcceptMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionAcceptFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionAcceptMutation",
	]),
	keys() {
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
