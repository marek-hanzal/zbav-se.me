import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionAccept } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionAcceptError,
	tApiTransactionAcceptRequest,
	tApiTransactionAcceptResponse,
} from "../../../api/seller/types.gen";
import { withTransactionQuery } from "../../../query/seller/transaction";

export const withTransactionAcceptMutation = withMutation<
	tApiTransactionAcceptRequest,
	tApiTransactionAcceptResponse[200],
	apiTransactionAcceptError
>({
	keys(variables) {
		return [
			"transaction",
			"accept",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionAccept(data));
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
