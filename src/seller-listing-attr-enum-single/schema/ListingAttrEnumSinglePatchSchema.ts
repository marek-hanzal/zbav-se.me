import { z } from "zod";

export const ListingAttrEnumSinglePatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type ListingAttrEnumSinglePatchSchema = typeof ListingAttrEnumSinglePatchSchema;

export namespace ListingAttrEnumSinglePatchSchema {
	export type Type = z.infer<ListingAttrEnumSinglePatchSchema>;
}
