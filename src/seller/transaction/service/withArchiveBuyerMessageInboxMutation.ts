import { withMutation } from "@/lib/client/mutation";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { withTransactionListingQuery } from "~/seller/transaction-listing/query/withTransactionListingQuery";
import { inboxArchiveFn } from "~/user/inbox/fn/inboxArchiveFn";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

const terminalStatuses: TransactionStatusEnumSchema.Type[] = [
	TransactionStatusEnumSchema.enum.rejected,
	TransactionStatusEnumSchema.enum.sold,
	TransactionStatusEnumSchema.enum.expired,
	TransactionStatusEnumSchema.enum.success,
	TransactionStatusEnumSchema.enum.closed,
];

export namespace withArchiveBuyerMessageInboxMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: TransactionStatusEnumSchema.Type;
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
