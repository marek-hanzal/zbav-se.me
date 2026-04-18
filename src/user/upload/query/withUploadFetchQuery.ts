import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { uploadFetchFn } from "~/user/upload/fn/uploadFetchFn";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const withUploadFetchQuery = withQuery<
	UploadQuerySchema.Type,
	UploadSchema.Type,
	uploadFetchFn.Error
>({
	logger: getRootLogger([
		"query",
		"withUploadFetchQuery",
	]),
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
