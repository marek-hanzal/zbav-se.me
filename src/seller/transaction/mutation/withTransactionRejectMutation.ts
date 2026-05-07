import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { transactionRejectFn } from "~/seller/transaction/fn/transactionRejectFn";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

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
