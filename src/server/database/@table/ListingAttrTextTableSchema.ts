import { z } from "zod";

export const ListingAttrTextTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type ListingAttrTextTableSchema = typeof ListingAttrTextTableSchema;

export namespace ListingAttrTextTableSchema {
	export type Type = z.infer<ListingAttrTextTableSchema>;
}
