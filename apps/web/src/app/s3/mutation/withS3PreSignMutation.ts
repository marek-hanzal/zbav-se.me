import { withMutation } from "@use-pico/client";
import {
	apiS3Presign,
	type S3PreSignRequest,
	type S3PreSignResponse,
} from "@zbav-se.me/sdk";

export const withS3PreSignMutation = withMutation<
	S3PreSignRequest,
	S3PreSignResponse
>({
	keys(variables) {
		return [
			"s3",
			"pre-sign",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiS3Presign(variables).then((res) => res.data);
	},
});
