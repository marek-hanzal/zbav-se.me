import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessageDateCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessageDateCreateError,
	tApiTransactionMessageDateCreateResponse,
	tTransactionMessageDateCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessageDateCreateMutation = withMutation<
	tTransactionMessageDateCreate,
	tApiTransactionMessageDateCreateResponse[200],
	apiTransactionMessageDateCreateError
>({
	keys(variables) {
		return [
			"transaction-message-date",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessageDateCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
