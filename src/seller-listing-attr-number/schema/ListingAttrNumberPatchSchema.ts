import { z } from "zod";

export const ListingAttrNumberPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().int().nullable(),
	})
	.strip();

export type ListingAttrNumberPatchSchema = typeof ListingAttrNumberPatchSchema;

export namespace ListingAttrNumberPatchSchema {
	export type Type = z.infer<ListingAttrNumberPatchSchema>;
}
