import { z } from "@hono/zod-openapi";

export const ListingCartDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the cart item",
	}),
	userId: z.string().openapi({
		description: "ID of the user who added the item to cart",
	}),
	feedId: z.string().openapi({
		description: "Feed this listing belongs to",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingCartDbSchema = typeof ListingCartDbSchema;

export namespace ListingCartDbSchema {
	export type Type = z.infer<ListingCartDbSchema>;
}
