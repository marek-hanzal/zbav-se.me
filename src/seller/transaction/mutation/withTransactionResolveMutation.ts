import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { transactionResolveFn } from "~/seller/transaction/fn/transactionResolveFn";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionResolveMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionResolveFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionResolveMutation",
	]),
	keys() {
		return [
			"seller",
			"transaction",
			"resolve",
		];
	},
	async mutationFn(variables) {
		return transactionResolveFn({
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
