import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessagePersonalCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessagePersonalCreateError,
	tApiTransactionMessagePersonalCreateResponse,
	tTransactionMessagePersonalCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessagePersonalCreateMutation = withMutation<
	tTransactionMessagePersonalCreate,
	tApiTransactionMessagePersonalCreateResponse[200],
	apiTransactionMessagePersonalCreateError
>({
	keys(variables) {
		return [
			"transaction-message-personal",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessagePersonalCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
