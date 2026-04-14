import { withMutation } from "@/lib/client/mutation";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { activityArchiveFn } from "~/user/activity/fn/activityArchiveFn";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { withTransactionQuery } from "../query/withTransactionQuery";

const terminalStatuses: TransactionStatusEnumSchema.Type[] = [
	TransactionStatusEnumSchema.enum.rejected,
	TransactionStatusEnumSchema.enum.sold,
	TransactionStatusEnumSchema.enum.expired,
	TransactionStatusEnumSchema.enum.success,
	TransactionStatusEnumSchema.enum.closed,
];

export namespace withArchiveSellerMessageActivityMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: TransactionStatusEnumSchema.Type;
	}
}

export const withArchiveSellerMessageActivityMutation = withMutation<
	withArchiveSellerMessageActivityMutation.Variables,
	void,
	Error
>({
	keys(variables) {
		return [
			"activity",
			"archive",
			"seller-message",
			variables,
		];
	},
	async mutationFn({ transactionId, listingId, status }) {
		if (!terminalStatuses.includes(status)) {
			return;
		}

		return activityArchiveFn({
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
					withActivityQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
