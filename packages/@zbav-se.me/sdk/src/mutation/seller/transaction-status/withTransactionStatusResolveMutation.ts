import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusResolve } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionStatusResolveError,
	tApiTransactionStatusResolveResponse,
	tTransactionStatusResolve,
} from "../../../api/seller/types.gen";

export const withTransactionStatusResolveMutation = withMutation<
	tTransactionStatusResolve,
	tApiTransactionStatusResolveResponse[200],
	apiTransactionStatusResolveError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"resolve",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusResolve({
				body,
			}),
		);
	},
	invalidate: [],
});
