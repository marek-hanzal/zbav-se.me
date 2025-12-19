import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/user";

export const useHeroUpload = (items: tGalleryItem[]): tUpload => {
	const [hero] = items.map((item) => item.upload);

	if (!hero) {
		throw new Error("Hero upload not found");
	}

	return hero;
};
