import { z } from "@hono/zod-openapi";
import { FeedSchema } from "~/@user/feed/schema/FeedSchema";

export const ListingCartFeedSchema = z
	.object({
		...FeedSchema.shape,
		count: z.coerce.number().openapi({
			description: "Number of items in cart for this feed",
			type: "number",
		}),
	})
	.openapi("ListingCartFeed", {
		description: "Feed data from listing cart",
	});

export type ListingCartFeedSchema = typeof ListingCartFeedSchema;

export namespace ListingCartFeedSchema {
	export type Type = z.infer<ListingCartFeedSchema>;
}
