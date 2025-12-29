import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessageTextCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessageTextCreateError,
	tApiTransactionMessageTextCreateResponse,
	tTransactionMessageTextCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessageTextCreateMutation = withMutation<
	tTransactionMessageTextCreate,
	tApiTransactionMessageTextCreateResponse[200],
	apiTransactionMessageTextCreateError
>({
	keys(variables) {
		return [
			"transaction-message-text",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessageTextCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
