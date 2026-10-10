import { z } from "zod";

export const ListingAttrNumberTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number().int(),
	})
	.strip();

export type ListingAttrNumberTableSchema = typeof ListingAttrNumberTableSchema;

export namespace ListingAttrNumberTableSchema {
	export type Type = z.infer<ListingAttrNumberTableSchema>;
}
