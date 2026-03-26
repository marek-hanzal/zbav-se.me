import { withQuery } from "@use-pico/client/query";
import { uploadFetchFn } from "~/server/@user/upload/fn/uploadFetchFn";
import type { UploadQuerySchema } from "~/server/@user/upload/schema/UploadQuerySchema";
import type { UploadSchema } from "~/server/@user/upload/schema/UploadSchema";

export const withUploadFetchQuery = withQuery<UploadQuerySchema.Type, UploadSchema.Type>({
	keys(data) {
		return [
			"upload",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		return uploadFetchFn({
			data,
		});
	},
});
