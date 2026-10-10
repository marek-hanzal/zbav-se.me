import { z } from "zod";

export const ListingAttrEnumSingleTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type ListingAttrEnumSingleTableSchema = typeof ListingAttrEnumSingleTableSchema;

export namespace ListingAttrEnumSingleTableSchema {
	export type Type = z.infer<ListingAttrEnumSingleTableSchema>;
}
