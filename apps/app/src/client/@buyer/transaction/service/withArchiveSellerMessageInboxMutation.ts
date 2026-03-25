import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/buyer";
import {
	apiInboxArchive,
	type apiInboxArchiveError,
	type tApiInboxArchiveResponse,
	tInboxFamilyEnum,
	tInboxTypeEnum,
} from "@zbav-se.me/sdk/api/user";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";

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
	tApiInboxArchiveResponse[204],
	apiInboxArchiveError
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
		return withApi(
			apiInboxArchive({
				body: {
					where: {
						archivedAtIsNull: true,
						family: tInboxFamilyEnum.transaction,
						type: tInboxTypeEnum["seller-message"],
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
					withInboxQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
