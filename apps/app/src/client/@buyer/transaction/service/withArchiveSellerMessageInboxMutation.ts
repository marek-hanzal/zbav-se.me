import { withMutation } from "@use-pico/client/mutation";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";
import { inboxArchiveFn } from "~/server/@user/inbox/fn/inboxArchiveFn";

const terminalStatuses: tTransactionStatusEnum[] = [
	tTransactionStatusEnum.rejected,
	tTransactionStatusEnum.sold,
	tTransactionStatusEnum.expired,
	tTransactionStatusEnum.success,
	tTransactionStatusEnum.closed,
];

export namespace withArchiveSellerMessageInboxMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: tTransactionStatusEnum;
	}
}

export const withArchiveSellerMessageInboxMutation = withMutation<
	withArchiveSellerMessageInboxMutation.Variables,
	void,
	Error
>({
	keys(variables) {
		return [
			"inbox",
			"archive",
			"seller-message",
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
					type: "seller-message",
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
					withInboxQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
