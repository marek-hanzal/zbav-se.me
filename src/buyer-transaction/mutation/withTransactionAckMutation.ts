import { transactionAckFn } from "~/buyer-transaction/fn/transactionAckFn";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export namespace withTransactionAckMutation {
	export interface Variables {
		listingId: string;
		transactionId: string;
	}
}

export const withTransactionAckMutation = withMutationFn<
	withTransactionAckMutation.Variables,
	unknown,
	transactionAckFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withTransactionAckMutation",
	]),
	keysFn(variables) {
		return [
			"buyer",
			"transaction",
			"ack",
			variables,
		];
	},
	async mutationFn(variables) {
		return transactionAckFn({
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
					withActivityQuery.invalidatorFn(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
