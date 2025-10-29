import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";

export const FeedSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the feed",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the feed",
		}),
		listing: ListingFilterSchema.openapi("ListingFilter", {
			description: "Filter used to fetch the listings",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().openapi({
			description:
				"Last update timestamp, used to sort the feed selection",
			type: "string",
		}),
	})
	.openapi("Feed");

export type FeedSchema = typeof FeedSchema;

export namespace FeedSchema {
	export type Type = z.infer<FeedSchema>;
}
