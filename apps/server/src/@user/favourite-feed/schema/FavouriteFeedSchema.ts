import { z } from "@hono/zod-openapi";
import { FeedSchema } from "~/@user/feed/schema/FeedSchema";

export const FavouriteFeedSchema = z
	.object({
		...FeedSchema.shape,
		count: z.coerce.number().openapi({
			description: "Number of items in favourites for this feed",
			type: "number",
		}),
	})
	.openapi("FavouriteFeed", {
		description: "Feed data from favourites",
	});

export type FavouriteFeedSchema = typeof FavouriteFeedSchema;

export namespace FavouriteFeedSchema {
	export type Type = z.infer<FavouriteFeedSchema>;
}
