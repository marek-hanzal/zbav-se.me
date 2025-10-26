import { withMutation } from "@use-pico/client";
import {
	apiUploadCreate,
	type UploadCreate,
	type UploadDto,
} from "@zbav-se.me/sdk";

export const withUploadCreateMutation = withMutation<UploadCreate, UploadDto>({
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiUploadCreate(variables).then((res) => res.data);
	},
});
