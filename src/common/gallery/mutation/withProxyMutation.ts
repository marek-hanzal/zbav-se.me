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
		if (uploadIds.length === 0) {
			return [];
		}

		const uploads = await uploadCollectionFn({
			data: {
				where: {
					idIn: uploadIds,
				},
			},
		});

		const uploadOrder = new Map(
			uploadIds.map((id, index) => [
				id,
				index,
			]),
		);

		return uploads.sort((left, right) => {
			return (uploadOrder.get(left.id) ?? 0) - (uploadOrder.get(right.id) ?? 0);
		});
	},
});
