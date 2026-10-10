import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
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

export const withTransactionAckMutation = withMutation<
	withTransactionAckMutation.Variables,
	unknown,
	transactionAckFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionAckMutation",
	]),
	keys(variables) {
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
