import { z } from "zod";

export const ListingAttrEnumMultiPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.array(z.string()),
	})
	.strip();

export type ListingAttrEnumMultiPatchSchema = typeof ListingAttrEnumMultiPatchSchema;

export namespace ListingAttrEnumMultiPatchSchema {
	export type Type = z.infer<ListingAttrEnumMultiPatchSchema>;
}
