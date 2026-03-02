import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionCreate } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionCreateError,
	tApiTransactionCreateResponse,
	tTransactionCreate,
} from "../../../api/buyer/types.gen";

export const withTransactionCreateMutation = withMutation<
	tTransactionCreate,
	tApiTransactionCreateResponse[201],
	apiTransactionCreateError
>({
	keys(variables) {
		return [
			"transaction",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionCreate({
				body,
			}),
		);
	},
});
