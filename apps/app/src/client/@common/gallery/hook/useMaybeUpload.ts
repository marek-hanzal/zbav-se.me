import type { GalleryItemSchema } from "~/client/@user/gallery-item/server/schema/GalleryItemSchema";
import type { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";

export const useMaybeUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type | undefined => {
	const [upload] = items.map((item) => item.upload);

	return upload;
};
