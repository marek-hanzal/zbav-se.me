import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";

export const isValid = (draft: DraftSchema.Type) => {
	const data = {
		...draft,
		uploadIds: draft.withUploadIds,
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
