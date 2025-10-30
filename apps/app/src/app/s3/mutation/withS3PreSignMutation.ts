import { withMutation } from "@use-pico/client";
import {
	apiS3Presign,
	type tS3PreSignRequest,
	type tS3PreSignResponse,
} from "@zbav-se.me/sdk";

export const withS3PreSignMutation = withMutation<
	tS3PreSignRequest,
	tS3PreSignResponse
>({
	keys(variables) {
		return [
			"s3",
			"pre-sign",
			variables,
		];
	},
	async mutationFn(body) {
		return apiS3Presign({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
