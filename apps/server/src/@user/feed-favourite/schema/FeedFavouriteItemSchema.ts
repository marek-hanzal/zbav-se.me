import { z } from "@hono/zod-openapi";
import { FeedFavouriteSchema } from "~/@user/feed-favourite/schema/FeedFavouriteSchema";

export const FeedFavouriteItemSchema = z
	.looseObject({
		...FeedFavouriteSchema.shape,
	})
	.strip()
	.openapi("FeedFavouriteItem", {
		description: "Feed favourite collection item",
	});

export type FeedFavouriteItemSchema = typeof FeedFavouriteItemSchema;

export namespace FeedFavouriteItemSchema {
	export type Type = z.infer<FeedFavouriteItemSchema>;
}
