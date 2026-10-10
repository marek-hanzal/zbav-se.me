import type { GalleryUploadSheet } from "~/gallery/ui/GalleryUploadSheet";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { uploadCollectionFn } from "~/user-upload/fn/uploadCollectionFn";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

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
