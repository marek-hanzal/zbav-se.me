import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionDisputeFn } from "~/seller/transaction/fn/transactionDisputeFn";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionDisputeMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	Error
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
					withTransactionListingQuery.invalidator(queryClient, [
						"fetch",
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
