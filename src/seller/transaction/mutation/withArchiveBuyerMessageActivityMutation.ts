import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { activityArchiveFn } from "~/user/activity/fn/activityArchiveFn";

const terminalStatuses: TransactionStatusEnumSchema.Type[] = [
	TransactionStatusEnumSchema.enum.rejected,
	TransactionStatusEnumSchema.enum.sold,
	TransactionStatusEnumSchema.enum.expired,
	TransactionStatusEnumSchema.enum.success,
	TransactionStatusEnumSchema.enum.closed,
];

export namespace withArchiveBuyerMessageActivityMutation {
	export interface Variables {
		transactionId: string;
		listingId: string;
		status: TransactionStatusEnumSchema.Type;
	}
}

export const withArchiveBuyerMessageActivityMutation = withMutation<
	withArchiveBuyerMessageActivityMutation.Variables,
	void,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withArchiveBuyerMessageActivityMutation",
	]),
	keys(variables) {
		return [
			"activity",
			"archive",
			"buyer-message",
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
					type: "buyer-message",
					referenceAllIn: [
						transactionId,
						listingId,
					],
				},
			},
		});
	},
});
