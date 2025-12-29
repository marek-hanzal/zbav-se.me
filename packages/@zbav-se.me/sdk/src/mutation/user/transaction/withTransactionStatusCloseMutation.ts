import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusClose } from "../../../api/user/sdk.gen";
import type {
	apiTransactionStatusCloseError,
	tApiTransactionStatusCloseResponse,
	tTransactionStatusClose,
} from "../../../api/user/types.gen";

export const withTransactionStatusCloseMutation = withMutation<
	tTransactionStatusClose,
	tApiTransactionStatusCloseResponse[200],
	apiTransactionStatusCloseError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"close",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusClose({
				body,
			}),
		);
	},
	invalidate: [],
});
