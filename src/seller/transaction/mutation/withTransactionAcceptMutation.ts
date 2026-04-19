import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionAcceptFn } from "~/seller/transaction/fn/transactionAcceptFn";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

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
