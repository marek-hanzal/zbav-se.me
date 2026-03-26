import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionSuccess } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionSuccessError,
	tApiTransactionSuccessRequest,
	tApiTransactionSuccessResponse,
} from "../../../api/buyer/types.gen";
import { withTransactionQuery } from "../../../query/buyer/transaction";

export const withTransactionSuccessMutation = withMutation<
	tApiTransactionSuccessRequest,
	tApiTransactionSuccessResponse[200],
	apiTransactionSuccessError
>({
	keys(variables) {
		return [
			"transaction",
			"success",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionSuccess(data));
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
