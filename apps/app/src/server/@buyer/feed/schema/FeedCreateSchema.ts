import { z } from "@hono/zod-openapi";
import { FeedTypeEnumSchema } from "~/server/@buyer/feed/enum/FeedTypeEnumSchema";
import { ListingQuerySchema } from "~/server/@buyer/listing/schema/ListingQuerySchema";

export const FeedCreateSchema = z
	.looseObject({
		type: FeedTypeEnumSchema.openapi({
			description: "Type of the feed",
		}),
		name: z.string().min(1).openapi({
			description: "Name of the feed",
		}),
		locationId: z
			.union([
				z.null(),
				z.string(),
			])
			.optional()
			.openapi({
				description: "ID of the location associated with the feed",
			}),
		query: ListingQuerySchema,
	})
	.strip()
	.openapi("FeedCreate", {
		description: "Data for creating a new feed",
	});

export type FeedCreateSchema = typeof FeedCreateSchema;

export namespace FeedCreateSchema {
	export type Type = z.infer<FeedCreateSchema>;
}
