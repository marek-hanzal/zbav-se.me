import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";
import { ListingMetaSchema } from "../../listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "../../listing/schema/ListingSortSchema";

export const FeedCreateSchema = z
	.object({
		name: z.string().min(1).openapi({
			description: "Name of the feed",
		}),
		locationId: z.string().nullish().openapi({
			description: "ID of the location associated with the feed",
		}),
		filter: ListingFilterSchema,
		sort: ListingSortSchema.array(),
		meta: ListingMetaSchema,
	})
	.openapi("FeedCreate", {
		description: "Data for creating a new feed",
	});

export type FeedCreateSchema = typeof FeedCreateSchema;

export namespace FeedCreateSchema {
	export type Type = z.infer<FeedCreateSchema>;
}
