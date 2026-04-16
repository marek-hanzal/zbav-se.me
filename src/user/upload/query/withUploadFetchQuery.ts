import { withQuery } from "@/lib/client/query";
import { uploadFetchFn } from "~/user/upload/fn/uploadFetchFn";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

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
