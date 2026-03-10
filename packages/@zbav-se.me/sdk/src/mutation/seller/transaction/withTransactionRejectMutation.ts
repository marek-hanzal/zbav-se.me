import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionSellerReject } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionSellerRejectError,
	tApiTransactionSellerRejectRequest,
	tApiTransactionSellerRejectResponse,
} from "../../../api/seller/types.gen";
import { withTransactionQuery } from "../../../query/seller/transaction";
import { withTransactionEntryQuery } from "../../../query/user/transaction-entry";

export const withTransactionRejectMutation = withMutation<
	tApiTransactionSellerRejectRequest,
	tApiTransactionSellerRejectResponse[200],
	apiTransactionSellerRejectError
>({
	keys(variables) {
		return [
			"transaction",
			"reject",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionSellerReject(data));
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withTransactionQuery.invalidator(queryClient, [
					"fetch",
				]);
				await withTransactionEntryQuery.invalidator(queryClient, [
					"collection",
					"count",
				]);
			},
		},
	],
});
