import { z } from "zod";

export const ListingAttrEnumMultiTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type ListingAttrEnumMultiTableSchema = typeof ListingAttrEnumMultiTableSchema;

export namespace ListingAttrEnumMultiTableSchema {
	export type Type = z.infer<ListingAttrEnumMultiTableSchema>;
}
