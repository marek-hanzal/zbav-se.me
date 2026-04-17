import type { QueryClient } from "@tanstack/react-query";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

export namespace archiveSellerMessageActivity {
	export interface Props {
		queryClient: QueryClient;
		transactionId: string;
	}
}

export const archiveSellerMessageActivity = async ({
	queryClient,
	transactionId,
}: archiveSellerMessageActivity.Props): Promise<void> => {
	const transaction = await withTransactionQuery.ensureEntityQuery(queryClient, {
		where: {
			id: transactionId,
		},
	});

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

	if (activityList.length === 0) {
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
		withActivityQuery.invalidator(queryClient, [
			"collection",
			"count",
		]),
	]);
};
