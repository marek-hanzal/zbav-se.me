import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/user";

export const useMaybeHeroUpload = (items: tGalleryItem[]): tUpload | undefined => {
	const [hero] = items.map((item) => item.upload);

	return hero;
};
