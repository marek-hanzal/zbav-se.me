import type { GalleryItemSchema } from "~/@user/gallery-item/server/schema/GalleryItemSchema";
import type { UploadSchema } from "~/@user/upload/server/schema/UploadSchema";

export const useMaybeUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type | undefined => {
	const [upload] = items.map((item) => item.upload);

	return upload;
};
