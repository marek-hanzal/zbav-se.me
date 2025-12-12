import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusAccept } from "../../api/user/sdk.gen";
import type {
	apiTransactionStatusAcceptError,
	tApiTransactionStatusAcceptResponse,
	tTransactionStatusAccept,
} from "../../api/user/types.gen";

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
