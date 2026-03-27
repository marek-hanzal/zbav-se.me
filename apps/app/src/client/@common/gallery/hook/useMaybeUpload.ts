import type { GalleryItemSchema } from "~/server/@user/gallery-item/schema/GalleryItemSchema";
import type { UploadSchema } from "~/server/@user/upload/schema/UploadSchema";

export const useMaybeUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type | undefined => {
	const [upload] = items.map((item) => item.upload);

	return upload;
};
