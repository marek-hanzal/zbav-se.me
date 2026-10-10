import { z } from "zod";

export const ListingAttrDecimalPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().nullable(),
	})
	.strip();

export type ListingAttrDecimalPatchSchema = typeof ListingAttrDecimalPatchSchema;

export namespace ListingAttrDecimalPatchSchema {
	export type Type = z.infer<ListingAttrDecimalPatchSchema>;
}
