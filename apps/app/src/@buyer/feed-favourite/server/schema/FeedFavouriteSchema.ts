import { z } from "zod";
import { FeedSchema } from "~/@buyer/feed/server/schema/FeedSchema";

export const FeedFavouriteSchema = z
	.looseObject({
		...FeedSchema.shape,
		count: z.coerce.number().meta({
			description: "Number of items in favourites for this feed",
			type: "number",
		}),
	})
	.strip()
	.meta({
		id: "FeedFavourite",
		description: "Feed data from favourites",
	});

export type FeedFavouriteSchema = typeof FeedFavouriteSchema;

export namespace FeedFavouriteSchema {
	export type Type = z.infer<FeedFavouriteSchema>;
}
