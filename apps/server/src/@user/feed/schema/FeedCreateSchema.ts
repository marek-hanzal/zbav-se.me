import { z } from "@hono/zod-openapi";
import { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";

export const FeedCreateSchema = z
	.object({
		name: z.string().min(1).openapi({
			description: "Name of the feed",
		}),
		locationId: z
			.union([
				z.string(),
				z.null(),
			])
			.optional()
			.openapi({
				description: "ID of the location associated with the feed",
			}),
		query: ListingQuerySchema,
	})
	.openapi("FeedCreate", {
		description: "Data for creating a new feed",
	});

export type FeedCreateSchema = typeof FeedCreateSchema;

export namespace FeedCreateSchema {
	export type Type = z.infer<FeedCreateSchema>;
}
