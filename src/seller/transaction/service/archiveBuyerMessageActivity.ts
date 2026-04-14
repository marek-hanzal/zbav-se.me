import type { QueryClient } from "@tanstack/react-query";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export namespace archiveBuyerMessageActivity {
	export interface Props {
		listingId: string;
		queryClient: QueryClient;
		transactionId: string;
	}
}

export const archiveBuyerMessageActivity = async ({
	listingId,
	queryClient,
	transactionId,
}: archiveBuyerMessageActivity.Props): Promise<void> => {
	const activityList = await withActivityQuery.patchCollectionFn(
		queryClient,
		{
			patch: {
				archivedAt: new Date(),
			},
			query: {
				where: {
					archivedAtIsNull: true,
					family: "transaction",
					type: "buyer-message",
					referenceAllIn: [
						transactionId,
						listingId,
					],
				},
			},
		},
		[
			"fetch",
			"collection",
			"count",
		],
	);

	if (activityList.length === 0) {
		return;
	}

	await Promise.all([
		withTransactionQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
		withTransactionListingQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
		withActivityQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
	]);
};
