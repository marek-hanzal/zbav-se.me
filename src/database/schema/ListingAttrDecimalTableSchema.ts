import { z } from "zod";

export const ListingAttrDecimalTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number(),
	})
	.strip();

export type ListingAttrDecimalTableSchema = typeof ListingAttrDecimalTableSchema;

export namespace ListingAttrDecimalTableSchema {
	export type Type = z.infer<ListingAttrDecimalTableSchema>;
}
