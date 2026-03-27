import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";

export const isValid = (draft: DraftSchema.Type) => {
	const data = {
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	};
	const isValid = ListingCreateSchema.safeParse(data).success;

	return {
		isValid,
		data,
	} as
		| {
				isValid: true;
				data: ListingCreateSchema.Type;
		  }
		| {
				isValid: false;
				data: undefined;
		  };
};
