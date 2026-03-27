import type { QueryClient } from "@tanstack/react-query";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";
import { withTransactionQuery } from "../withTransactionQuery";

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
				archivedAt: new Date(),
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
