import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiFeedPatch } from "../../../api/buyer-user/sdk.gen";
import type {
	apiFeedPatchError,
	tApiFeedPatchResponse,
	tFeedPatch,
} from "../../../api/buyer-user/types.gen";

export const withFeedPatchMutation = withMutation<
	tFeedPatch,
	tApiFeedPatchResponse[200],
	apiFeedPatchError
>({
	keys(variables) {
		return [
			"feed",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiFeedPatch({
				body,
			}),
		);
	},
	invalidate: [],
});
