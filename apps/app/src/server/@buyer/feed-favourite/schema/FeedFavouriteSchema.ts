import { z } from "@hono/zod-openapi";
import { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

export const FeedFavouriteSchema = z
	.looseObject({
		...FeedSchema.shape,
		count: z.coerce.number().openapi({
			description: "Number of items in favourites for this feed",
			type: "number",
		}),
	})
	.strip()
	.openapi("FeedFavourite", {
		description: "Feed data from favourites",
	});

export type FeedFavouriteSchema = typeof FeedFavouriteSchema;

export namespace FeedFavouriteSchema {
	export type Type = z.infer<FeedFavouriteSchema>;
}
