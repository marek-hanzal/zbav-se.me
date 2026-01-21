import { z } from "@hono/zod-openapi";

export const FeedItemSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the feed",
		}),
	})
	.openapi("FeedItemSchema", {
		description: "Feed collection item",
	});

export type FeedItemSchema = typeof FeedItemSchema;

export namespace FeedItemSchema {
	export type Type = z.infer<FeedItemSchema>;
}
