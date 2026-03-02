import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusAccept } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionStatusAcceptError,
	tApiTransactionStatusAcceptResponse,
	tTransactionStatusAccept,
} from "../../../api/seller/types.gen";

export const withTransactionStatusAcceptMutation = withMutation<
	tTransactionStatusAccept,
	tApiTransactionStatusAcceptResponse[200],
	apiTransactionStatusAcceptError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"accept",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusAccept({
				body,
			}),
		);
	},
	invalidate: [],
});
