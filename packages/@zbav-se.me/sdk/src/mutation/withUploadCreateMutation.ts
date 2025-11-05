import { withMutation } from "@use-pico/client/mutation";
import { apiUploadCreate } from "../api/session/sdk.gen";
import type {
	tApiUploadCreateResponse,
	tUploadCreate,
} from "../api/session/types.gen";

export const withUploadCreateMutation = withMutation<
	tUploadCreate,
	tApiUploadCreateResponse[201]
>({
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn(body) {
		return apiUploadCreate({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
