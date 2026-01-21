import { z } from "@hono/zod-openapi";

export const FeedFavouriteItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the feed favourite",
		}),
	})
	.strip()
	.openapi("FeedFavouriteItemSchema", {
		description: "Feed favourite collection item",
	});

export type FeedFavouriteItemSchema = typeof FeedFavouriteItemSchema;

export namespace FeedFavouriteItemSchema {
	export type Type = z.infer<FeedFavouriteItemSchema>;
}
