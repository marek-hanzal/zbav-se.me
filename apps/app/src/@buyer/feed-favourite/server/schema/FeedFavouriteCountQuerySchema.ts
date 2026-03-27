import { z } from "zod";
import { FeedQuerySchema } from "~/@buyer/feed/server/schema/FeedQuerySchema";

export const FeedFavouriteCountQuerySchema = z
	.looseObject({
		...FeedQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FeedFavouriteCountQuery",
		description: "Query object for feed favourite count",
	});

export type FeedFavouriteCountQuerySchema = typeof FeedFavouriteCountQuerySchema;

export namespace FeedFavouriteCountQuerySchema {
	export type Type = z.infer<FeedFavouriteCountQuerySchema>;
}
