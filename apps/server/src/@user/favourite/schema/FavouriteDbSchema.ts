import { z } from "@hono/zod-openapi";

export const FavouriteDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the favourite item",
	}),
	userId: z.string().openapi({
		description: "ID of the user who added the item to favourites",
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

export type FavouriteDbSchema = typeof FavouriteDbSchema;

export namespace FavouriteDbSchema {
	export type Type = z.infer<FavouriteDbSchema>;
}
