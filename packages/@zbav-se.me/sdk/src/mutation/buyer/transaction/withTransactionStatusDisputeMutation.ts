import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusDispute } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionStatusDisputeError,
	tApiTransactionStatusDisputeResponse,
	tTransactionStatusDispute,
} from "../../../api/buyer/types.gen";

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
