import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusDispute } from "../../../api/seller-user/sdk.gen";
import type {
	apiTransactionStatusDisputeError,
	tApiTransactionStatusDisputeResponse,
	tTransactionStatusDispute,
} from "../../../api/seller-user/types.gen";

export const withTransactionStatusDisputeMutation = withMutation<
	tTransactionStatusDispute,
	tApiTransactionStatusDisputeResponse[200],
	apiTransactionStatusDisputeError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"dispute",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusDispute({
				body,
			}),
		);
	},
	invalidate: [],
});
