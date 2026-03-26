import { withMutation } from "@use-pico/client/mutation";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";
import { inboxArchiveFn } from "~/server/@user/inbox/fn/inboxArchiveFn";

const terminalStatuses: tTransactionStatusEnum[] = [
	tTransactionStatusEnum.rejected,
	tTransactionStatusEnum.sold,
	tTransactionStatusEnum.expired,
	tTransactionStatusEnum.success,
	tTransactionStatusEnum.closed,
];

export namespace withArchiveBuyerMessageInboxMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: tTransactionStatusEnum;
	}
}

export const withArchiveBuyerMessageInboxMutation = withMutation<
	withArchiveBuyerMessageInboxMutation.Variables,
	void,
	Error
>({
	keys(variables) {
		return [
			"inbox",
			"archive",
			"buyer-message",
			variables,
		];
	},
	async mutationFn({ transactionId, listingId, status }) {
		if (!terminalStatuses.includes(status)) {
			return;
		}

		return inboxArchiveFn({
			data: {
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
		});
	},
	invalidate: [
		{
			async invalidate(queryClient) {
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
			},
		},
	],
});
