import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/user";

export const useMaybeUpload = (items: tGalleryItem[]): tUpload | undefined => {
	const [upload] = items.map((item) => item.upload);

	return upload;
};
