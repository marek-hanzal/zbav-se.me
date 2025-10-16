import { withMutation } from "@use-pico/client";
import {
	apiContentUpload,
	type HandleUploadBody,
	type HandleUploadResponse,
} from "@zbav-se.me/sdk";

export const withContentUploadMutation = withMutation<
	HandleUploadBody,
	HandleUploadResponse
>({
	keys(variables) {
		return [
			"content",
			"upload",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiContentUpload(variables).then((res) => res.data);
	},
});
