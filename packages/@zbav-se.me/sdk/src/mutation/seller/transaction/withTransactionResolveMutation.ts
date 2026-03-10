import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionResolve } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionResolveError,
	tApiTransactionResolveRequest,
	tApiTransactionResolveResponse,
} from "../../../api/seller/types.gen";

export const withTransactionResolveMutation = withMutation<
	tApiTransactionResolveRequest,
	tApiTransactionResolveResponse[200],
	apiTransactionResolveError
>({
	keys(variables) {
		return [
			"transaction",
			"resolve",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionResolve(data));
	},
	invalidate: [],
});
