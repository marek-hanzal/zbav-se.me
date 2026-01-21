import { z } from "@hono/zod-openapi";

export const FeedItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the feed",
		}),
	})
	.strip()
	.openapi("FeedItemSchema", {
		description: "Feed collection item",
	});

export type FeedItemSchema = typeof FeedItemSchema;

export namespace FeedItemSchema {
	export type Type = z.infer<FeedItemSchema>;
}
