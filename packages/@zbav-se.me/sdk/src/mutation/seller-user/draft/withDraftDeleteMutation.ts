import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftDelete } from "../../../api/seller-user/sdk.gen";
import type {
	apiDraftDeleteError,
	tApiDraftDeleteResponse,
	tDraftQuery,
} from "../../../api/seller-user/types.gen";

export const withDraftDeleteMutation = withMutation<
	tDraftQuery,
	tApiDraftDeleteResponse[200],
	apiDraftDeleteError
>({
	keys(variables) {
		return [
			"draft",
			"delete",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiDraftDelete({
				body,
			}),
		);
	},
});
