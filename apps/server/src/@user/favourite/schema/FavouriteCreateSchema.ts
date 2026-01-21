import { z } from "@hono/zod-openapi";

export const FavouriteCreateSchema = z
	.looseObject({
		feedId: z.string().openapi({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.strip()
	.openapi({
		description: "Favourite create schema",
	});

export type FavouriteCreateSchema = typeof FavouriteCreateSchema;

export namespace FavouriteCreateSchema {
	export type Type = z.infer<FavouriteCreateSchema>;
}
