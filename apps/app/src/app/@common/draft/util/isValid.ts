import { type tDraft, zListingCreate } from "@zbav-se.me/sdk/api/seller";

export const isValid = (draft: tDraft) => {
	const data = {
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	};
	const isValid = zListingCreate.safeParse(data).success;

	console.log("v", zListingCreate.safeParse(data));

	return {
		isValid,
		data,
	} as const;
};
