import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { uploadCollectionFn } from "~/user/upload/fn/uploadCollectionFn";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import type { GalleryUploadSheet } from "../ui/GalleryUploadSheet";

/**
 * Useful when you don't need to do extra stuff with uploads using
 * gallery; this mutation just forwards given uploads to the output (result).
 */
export const withProxyMutation = withMutation<
	GalleryUploadSheet.Uploads,
	UploadSchema.Type[],
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withProxyMutation",
	]),
	keys(variables) {
		return [
			"gallery",
			"proxy",
			variables,
		];
	},
	async mutationFn({ uploadIds }) {
		return uploadCollectionFn({
			data: {
				where: {
					idIn: uploadIds,
				},
			},
		});
	},
});
