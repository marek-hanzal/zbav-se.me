import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { uploadFetchFn } from "~/user/upload/fn/uploadFetchFn";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

const logger = getRootLogger([
	"query",
	"withUploadFetchQuery",
]);

export const withUploadFetchQuery = withQuery<UploadQuerySchema.Type, UploadSchema.Type>({
	keys(data) {
		return [
			"upload",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return uploadFetchFn({
			data,
		});
	},
});
