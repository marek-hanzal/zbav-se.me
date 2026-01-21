import { z } from "@hono/zod-openapi";

export const ListingItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.strip()
	.openapi("ListingItemSchema", {
		description: "Listing collection item",
	});

export type ListingItemSchema = typeof ListingItemSchema;

export namespace ListingItemSchema {
	export type Type = z.infer<ListingItemSchema>;
}
