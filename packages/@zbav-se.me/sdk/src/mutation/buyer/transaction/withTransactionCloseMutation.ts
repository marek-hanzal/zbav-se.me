import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionClose } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionCloseError,
	tApiTransactionCloseRequest,
	tApiTransactionCloseResponse,
} from "../../../api/buyer/types.gen";
import { withTransactionQuery } from "../../../query/buyer/transaction";

export const withTransactionCloseMutation = withMutation<
	tApiTransactionCloseRequest,
	tApiTransactionCloseResponse[200],
	apiTransactionCloseError
>({
	keys(variables) {
		return [
			"transaction",
			"close",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionClose(data));
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
