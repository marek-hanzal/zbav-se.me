import { withMutation } from "@use-pico/client/mutation";
import { uploadCreateFn } from "~/server/@user/upload/fn/uploadCreateFn";
import type { UploadCreateSchema } from "~/server/@user/upload/schema/UploadCreateSchema";
import type { UploadSchema } from "~/server/@user/upload/schema/UploadSchema";

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
