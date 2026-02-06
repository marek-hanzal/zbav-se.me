import type { tGalleryItem, tUpload } from "@zbav-se.me/sdk/api/user";
import { useMaybeHeroUpload } from "~/app/@common/gallery/hook/useMaybeHeroUpload";

export const useHeroUpload = (items: tGalleryItem[]): tUpload => {
	const hero = useMaybeHeroUpload(items);

	if (!hero) {
		throw new Error("Hero upload not found");
	}

	return hero;
};
