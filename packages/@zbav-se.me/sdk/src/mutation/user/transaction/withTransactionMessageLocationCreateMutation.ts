import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessageLocationCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessageLocationCreateError,
	tApiTransactionMessageLocationCreateResponse,
	tTransactionMessageLocationCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessageLocationCreateMutation = withMutation<
	tTransactionMessageLocationCreate,
	tApiTransactionMessageLocationCreateResponse[200],
	apiTransactionMessageLocationCreateError
>({
	keys(variables) {
		return [
			"transaction-message-location",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessageLocationCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
