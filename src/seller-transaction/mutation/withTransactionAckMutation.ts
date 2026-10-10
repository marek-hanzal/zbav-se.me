import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { transactionAckFn } from "~/seller-transaction/fn/transactionAckFn";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
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
			"seller",
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
