import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiUploadCreate } from "../../api/session/sdk.gen";
import type { apiUploadCreateError, tApiUploadCreateResponse, tUploadCreate } from "../../api/session/types.gen";

export const withUploadCreateMutation = withMutation<
	tUploadCreate,
	tApiUploadCreateResponse[201],
	apiUploadCreateError
>({
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiUploadCreate({
				body,
			}),
		);
	},
});
