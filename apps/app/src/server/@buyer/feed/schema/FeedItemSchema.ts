import { z } from "@hono/zod-openapi";
import { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

export const FeedItemSchema = z
	.looseObject({
		...FeedSchema.shape,
	})
	.strip()
	.openapi("FeedItem", {
		description: "Feed collection item",
	});

export type FeedItemSchema = typeof FeedItemSchema;

export namespace FeedItemSchema {
	export type Type = z.infer<FeedItemSchema>;
}
