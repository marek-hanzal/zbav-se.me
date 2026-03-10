import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionDispute } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionDisputeError,
	tApiTransactionDisputeRequest,
	tApiTransactionDisputeResponse,
} from "../../../api/buyer/types.gen";

export const withTransactionDisputeMutation = withMutation<
	tApiTransactionDisputeRequest,
	tApiTransactionDisputeResponse[200],
	apiTransactionDisputeError
>({
	keys(variables) {
		return [
			"transaction",
			"dispute",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionDispute(data));
	},
	invalidate: [],
});
