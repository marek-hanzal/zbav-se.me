import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionSellerDispute } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionSellerDisputeError,
	tApiTransactionSellerDisputeRequest,
	tApiTransactionSellerDisputeResponse,
} from "../../../api/seller/types.gen";
import { withTransactionQuery } from "../../../query/seller/transaction";

export const withTransactionDisputeMutation = withMutation<
	tApiTransactionSellerDisputeRequest,
	tApiTransactionSellerDisputeResponse[200],
	apiTransactionSellerDisputeError
>({
	keys(variables) {
		return [
			"transaction",
			"dispute",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionSellerDispute(data));
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withTransactionQuery.invalidator(queryClient, [
					"fetch",
				]);
			},
		},
	],
});
