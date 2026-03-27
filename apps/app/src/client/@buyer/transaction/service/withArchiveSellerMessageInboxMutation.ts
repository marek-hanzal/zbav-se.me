import { withMutation } from "@use-pico/client/mutation";
import { withInboxQuery } from "~/client/@user/inbox/withInboxQuery";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { inboxArchiveFn } from "~/server/@user/inbox/fn/inboxArchiveFn";
import { withTransactionQuery } from "../withTransactionQuery";

const terminalStatuses: TransactionStatusEnumSchema.Type[] = [
	TransactionStatusEnumSchema.enum.rejected,
	TransactionStatusEnumSchema.enum.sold,
	TransactionStatusEnumSchema.enum.expired,
	TransactionStatusEnumSchema.enum.success,
	TransactionStatusEnumSchema.enum.closed,
];

export namespace withArchiveSellerMessageInboxMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: TransactionStatusEnumSchema.Type;
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
