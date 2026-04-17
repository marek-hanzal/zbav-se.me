import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { uploadCreateFn } from "~/user/upload/fn/uploadCreateFn";
import type { UploadCreateSchema } from "~/user/upload/server/schema/UploadCreateSchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const withUploadCreateMutation = withMutation<
	UploadCreateSchema.Type,
	UploadSchema.Type,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withUploadCreateMutation",
	]),
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
