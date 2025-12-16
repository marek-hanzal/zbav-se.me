import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftPatch } from "../../../api/user/sdk.gen";
import type {
	apiDraftPatchError,
	tApiDraftPatchResponse,
	tDraftPatch,
} from "../../../api/user/types.gen";

export const withDraftPatchMutation = withMutation<
	tDraftPatch,
	tApiDraftPatchResponse[200],
	apiDraftPatchError
>({
	keys(variables) {
		return [
			"draft",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiDraftPatch({
				body,
			}),
		);
	},
	invalidate: [],
});
