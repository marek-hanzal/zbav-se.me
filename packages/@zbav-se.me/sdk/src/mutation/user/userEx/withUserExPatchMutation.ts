import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiUserExPatch } from "../../../api/user/sdk.gen";
import type {
	apiUserExPatchError,
	tApiUserExPatchResponse,
	tUserExPatch,
} from "../../../api/user/types.gen";

export const withUserExPatchMutation = withMutation<
	tUserExPatch,
	tApiUserExPatchResponse[200],
	apiUserExPatchError
>({
	keys(data) {
		return [
			"user-ex",
			"patch",
			data,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiUserExPatch({
				body,
			}),
		);
	},
});
