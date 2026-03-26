import { z } from "@hono/zod-openapi";
import { FeedQuerySchema } from "~/server/@buyer/feed/schema/FeedQuerySchema";

export const FeedFavouriteCountQuerySchema = z
	.looseObject({
		...FeedQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("FeedFavouriteCountQuery", {
		description: "Query object for feed favourite count",
	});

export type FeedFavouriteCountQuerySchema = typeof FeedFavouriteCountQuerySchema;

export namespace FeedFavouriteCountQuerySchema {
	export type Type = z.infer<FeedFavouriteCountQuerySchema>;
}
