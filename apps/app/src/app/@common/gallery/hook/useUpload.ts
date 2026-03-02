import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/user";
import { useMaybeUpload } from "./useMaybeUpload";

export const useUpload = (items: tGalleryItem[]): tUpload => {
	const upload = useMaybeUpload(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
