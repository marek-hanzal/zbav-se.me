import { z } from "zod";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { FeedCreateSchema } from "./FeedCreateSchema";

export const FeedToolCreateSchema = z
	.looseObject({
		...FeedCreateSchema.shape,
		query: ListingToolQuerySchema,
	})
	.strip()
	.meta({
		id: "FeedToolCreate",
		description: "Data for creating a new feed via tool",
	});

export type FeedToolCreateSchema = typeof FeedToolCreateSchema;

export namespace FeedToolCreateSchema {
	export type Type = z.infer<FeedToolCreateSchema>;
}
