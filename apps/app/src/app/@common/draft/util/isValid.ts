import { type tDraft, zListingCreate } from "@zbav-se.me/sdk/api/seller-user";

export const isValid = (draft: tDraft) => {
	return zListingCreate.safeParse({
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	}).success;
};
