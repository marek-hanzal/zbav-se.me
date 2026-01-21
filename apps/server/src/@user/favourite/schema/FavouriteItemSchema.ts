import { z } from "@hono/zod-openapi";

export const FavouriteItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the favourite",
		}),
	})
	.strip()
	.openapi("FavouriteItemSchema", {
		description: "Favourite collection item",
	});

export type FavouriteItemSchema = typeof FavouriteItemSchema;

export namespace FavouriteItemSchema {
	export type Type = z.infer<FavouriteItemSchema>;
}
