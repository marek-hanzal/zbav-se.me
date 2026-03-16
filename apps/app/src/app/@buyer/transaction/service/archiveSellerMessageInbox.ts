import type { QueryClient } from "@tanstack/react-query";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";

export namespace archiveSellerMessageInbox {
	export interface Props {
		queryClient: QueryClient;
		transactionId: string;
	}
}

export const archiveSellerMessageInbox = async ({
	queryClient,
	transactionId,
}: archiveSellerMessageInbox.Props): Promise<void> => {
	const transaction = await withTransactionQuery.fetchFn({
		where: {
			id: transactionId,
		},
	});

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
						type: "seller-message",
						referenceAllIn: [
							transactionId,
							transaction.listingId,
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
		await withTransactionQuery.invalidator(queryClient, [
			"collection",
			"count",
		]);

		return;
	}

	await Promise.all([
		withTransactionQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
		withInboxQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
	]);
};
