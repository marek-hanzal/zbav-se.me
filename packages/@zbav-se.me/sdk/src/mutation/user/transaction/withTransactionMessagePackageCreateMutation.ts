import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessagePackageCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessagePackageCreateError,
	tApiTransactionMessagePackageCreateResponse,
	tTransactionMessagePackageCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessagePackageCreateMutation = withMutation<
	tTransactionMessagePackageCreate,
	tApiTransactionMessagePackageCreateResponse[200],
	apiTransactionMessagePackageCreateError
>({
	keys(variables) {
		return [
			"transaction-message-package",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessagePackageCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
