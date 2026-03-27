import type { GalleryItemSchema } from "~/client/@user/gallery-item/server/schema/GalleryItemSchema";
import type { UploadSchema } from "~/client/@user/upload/server/schema/UploadSchema";
import { useMaybeUpload } from "./useMaybeUpload";

export const useUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type => {
	const upload = useMaybeUpload(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
