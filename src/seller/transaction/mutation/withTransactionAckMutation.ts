import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { transactionAckFn } from "../fn/transactionAckFn";
import { withTransactionQuery } from "../query/withTransactionQuery";

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
