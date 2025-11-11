import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../../@session/listing/schema/ListingFilterSchema";
import { ListingMetaSchema } from "../../../@session/listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "../../../@session/listing/schema/ListingSortSchema";

export const FeedDbSchema = z.object({
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
	filter: ListingFilterSchema.optional(),
	sort: ListingSortSchema.array().optional(),
	meta: ListingMetaSchema.optional(),
	//
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
	updatedAt: z.coerce.date().openapi({
		description: "Last update timestamp, used to sort the feed selection",
		type: "string",
	}),
});

export type FeedDbSchema = typeof FeedDbSchema;

export namespace FeedDbSchema {
	export type Type = z.infer<FeedDbSchema>;
}
