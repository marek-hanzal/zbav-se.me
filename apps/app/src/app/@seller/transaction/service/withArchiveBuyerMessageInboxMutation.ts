import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/seller";
import {
	apiInboxArchive,
	type apiInboxArchiveError,
	type tApiInboxArchiveResponse,
	tInboxFamilyEnum,
	tInboxTypeEnum,
} from "@zbav-se.me/sdk/api/user";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";

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
	tApiInboxArchiveResponse[204],
	apiInboxArchiveError
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
		return withApi(
			apiInboxArchive({
				body: {
					where: {
						archivedAtIsNull: true,
						family: tInboxFamilyEnum.transaction,
						type: tInboxTypeEnum["buyer-message"],
						referenceAllIn: [
							transactionId,
							listingId,
						],
					},
				},
			}),
		);
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
