import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessageGalleryCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionMessageGalleryCreateError,
	tApiTransactionMessageGalleryCreateResponse,
	tTransactionMessageGalleryCreate,
} from "../../../api/user/types.gen";

export const withTransactionMessageGalleryCreateMutation = withMutation<
	tTransactionMessageGalleryCreate,
	tApiTransactionMessageGalleryCreateResponse[200],
	apiTransactionMessageGalleryCreateError
>({
	keys(variables) {
		return [
			"transaction-message-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessageGalleryCreate({
				body,
			}),
		);
	},
	invalidate: [],
});
