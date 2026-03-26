import type { QueryClient } from "@tanstack/react-query";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";

export namespace archiveBuyerMessageInbox {
	export interface Props {
		listingId: string;
		queryClient: QueryClient;
		transactionId: string;
	}
}

export const archiveBuyerMessageInbox = async ({
	listingId,
	queryClient,
	transactionId,
}: archiveBuyerMessageInbox.Props): Promise<void> => {
	const inboxList = await withInboxQuery.patchCollectionFn(
		queryClient,
		{
			patch: {
				archivedAt: new Date().toISOString(),
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

	if (inboxList.length === 0) {
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
		withInboxQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
	]);
};
