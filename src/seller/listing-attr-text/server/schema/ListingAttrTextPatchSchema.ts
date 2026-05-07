import { z } from "zod";

export const ListingAttrTextPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type ListingAttrTextPatchSchema = typeof ListingAttrTextPatchSchema;

export namespace ListingAttrTextPatchSchema {
	export type Type = z.infer<ListingAttrTextPatchSchema>;
}
