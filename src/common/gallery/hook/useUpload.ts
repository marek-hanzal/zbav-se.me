import type { GalleryItemSchema } from "~/user/gallery-item/server/schema/GalleryItemSchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import { useMaybeUpload } from "./useMaybeUpload";

export const useUpload = (items: GalleryItemSchema.Type[]): UploadSchema.Type => {
	const upload = useMaybeUpload(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
