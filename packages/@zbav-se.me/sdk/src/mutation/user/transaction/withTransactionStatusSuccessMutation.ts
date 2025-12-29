import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusSuccess } from "../../../api/user/sdk.gen";
import type {
	apiTransactionStatusSuccessError,
	tApiTransactionStatusSuccessResponse,
	tTransactionStatusSuccess,
} from "../../../api/user/types.gen";

export const withTransactionStatusSuccessMutation = withMutation<
	tTransactionStatusSuccess,
	tApiTransactionStatusSuccessResponse[200],
	apiTransactionStatusSuccessError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"success",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusSuccess({
				body,
			}),
		);
	},
	invalidate: [],
});
