import { z } from "zod";

export const ListingItemSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing",
		}),
	})
	.strip()
	.meta({
		id: "ListingItem",
		description: "Listing collection item",
	});

export type ListingItemSchema = typeof ListingItemSchema;

export namespace ListingItemSchema {
	export type Type = z.infer<ListingItemSchema>;
}
