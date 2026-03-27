import { withMutation } from "@use-pico/client/mutation";
import { uploadCreateFn } from "~/user/upload/server/fn/uploadCreateFn";
import type { UploadCreateSchema } from "~/user/upload/server/schema/UploadCreateSchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const withUploadCreateMutation = withMutation<
	UploadCreateSchema.Type,
	UploadSchema.Type,
	Error
>({
	keys(variables) {
		return [
			"upload",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return uploadCreateFn({
			data: body,
		});
	},
});
