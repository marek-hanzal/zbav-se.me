import { z } from "@hono/zod-openapi";

export const ListingItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.openapi("ListingItemSchema", {
		description: "Listing collection item",
	});

export type ListingItemSchema = typeof ListingItemSchema;

export namespace ListingItemSchema {
	export type Type = z.infer<ListingItemSchema>;
}
