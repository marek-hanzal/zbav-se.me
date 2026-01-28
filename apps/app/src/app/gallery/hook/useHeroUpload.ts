import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/seller-user";
import { useMaybeHeroUpload } from "./useMaybeHeroUpload";

export const useHeroUpload = (items: tGalleryItem[]): tUpload => {
	const hero = useMaybeHeroUpload(items);

	if (!hero) {
		throw new Error("Hero upload not found");
	}

	return hero;
};
