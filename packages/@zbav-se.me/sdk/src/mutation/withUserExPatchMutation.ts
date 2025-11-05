import { withMutation } from "@use-pico/client/mutation";
import { apiUserExPatch } from "../api/session/sdk.gen";
import type {
	tApiUserExPatchResponse,
	tUserPatch,
} from "../api/session/types.gen";

export const withUserExPatchMutation = withMutation<
	tUserPatch,
	tApiUserExPatchResponse[204]
>({
	keys(data) {
		return [
			"user-ex",
			"patch",
			data,
		];
	},
	async mutationFn(body) {
		return apiUserExPatch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
