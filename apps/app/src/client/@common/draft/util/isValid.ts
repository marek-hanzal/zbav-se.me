import { zListingCreate } from "@zbav-se.me/sdk/api/seller";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";

export const isValid = (draft: DraftSchema.Type) => {
	const data = {
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	};
	const isValid = zListingCreate.safeParse(data).success;

	return {
		isValid,
		data,
	} as const;
};
