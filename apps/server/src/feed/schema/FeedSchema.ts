import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";
import { ListingMetaSchema } from "../../listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "../../listing/schema/ListingSortSchema";

export const FeedSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the feed",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the feed",
		}),
		locationId: z.string().nullish().openapi({
			description: "ID of the location associated with the feed",
		}),
		//
		name: z.string().openapi({
			description: "Name of the feed",
		}),
		filter: ListingFilterSchema.optional().openapi({
			description: "Filter used to fetch the listings",
		}),
		sort: ListingSortSchema.array().optional().openapi({
			description: "Filter used to fetch the listings",
		}),
		meta: ListingMetaSchema.optional().openapi({
			description: "Metadata used to fetch the listings (e.g. location)",
		}),
		//
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
