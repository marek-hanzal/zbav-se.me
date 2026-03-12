import { useQueryClient } from "@tanstack/react-query";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { useEffect } from "react";

export namespace TransactionDetailInvalidate {
	export interface Props {
		transactionId: string;
	}
}

export const TransactionDetailInvalidate: FC<TransactionDetailInvalidate.Props> = ({
	transactionId,
}) => {
	const queryClient = useQueryClient();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	useEffect(() => {
		const archiveUnreadFx = async () => {
			try {
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
								referenceIn: [
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
					return;
				}

				const [refetchedTransaction, refetchedTransactionListing] =
					await Promise.allSettled([
						withTransactionQuery.fetchFn({
							where: {
								id: transaction.id,
							},
						}),
						withTransactionListingQuery.fetchFn({
							where: {
								id: transaction.listingId,
							},
						}),
					]);

				if (refetchedTransaction.status === "fulfilled") {
					withTransactionQuery.updateFn(queryClient, refetchedTransaction.value);
				}

				if (refetchedTransactionListing.status === "fulfilled") {
					withTransactionListingQuery.updateFn(
						queryClient,
						refetchedTransactionListing.value,
					);
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
				]);
			} catch {
				// Keep detail navigation usable even if unread archival fails.
			}
		};

		void archiveUnreadFx();
	}, [
		queryClient,
		transaction.id,
		transaction.listingId,
		transactionId,
	]);

	return null;
};
