import type { GalleryItemSchema } from "~/server/@user/gallery-item/schema/GalleryItemSchema";
import type { UploadSchema } from "~/server/@user/upload/schema/UploadSchema";
import { useMaybeUpload } from "./useMaybeUpload";

export const useUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type => {
	const upload = useMaybeUpload(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
