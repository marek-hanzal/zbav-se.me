import { withQuery } from "@use-pico/client/query";
import { uploadFetchFn } from "~/client/@user/upload/server/fn/uploadFetchFn";
import type { UploadQuerySchema } from "~/client/@user/upload/server/schema/UploadQuerySchema";
import type { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";

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
