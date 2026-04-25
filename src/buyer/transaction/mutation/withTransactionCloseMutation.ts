import { withMutation } from "@/lib/client/mutation";
import type { EntitySchema } from "@/lib/common/schema";
import { transactionCloseFn } from "~/buyer/transaction/fn/transactionCloseFn";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export const withTransactionCloseMutation = withMutation<
	EntitySchema.Type,
	TransactionSchema.Type,
	transactionCloseFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionCloseMutation",
	]),
	keys() {
		return [
			"buyer",
			"transaction",
			"close",
		];
	},
	async mutationFn(variables) {
		return transactionCloseFn({
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
