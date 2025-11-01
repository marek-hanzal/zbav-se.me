import { withMutation } from "@use-pico/client/mutation";
import {
	apiUploadCreate,
	type tUploadCreate,
	type tUploadDto,
} from "@zbav-se.me/sdk";

export const withUploadCreateMutation = withMutation<tUploadCreate, tUploadDto>(
	{
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
	},
);
