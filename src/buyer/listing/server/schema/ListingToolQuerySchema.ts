import { z } from "zod";
import { ListingToolFilterSchema } from "~/buyer/listing/server/schema/ListingToolFilterSchema";

export const ListingToolQuerySchema = z
	.looseObject({
		filter: ListingToolFilterSchema.optional(),
		where: ListingToolFilterSchema.optional(),
	})
	.strip()
	.meta({
		id: "ListingToolQuery",
		description: "Query object for listing tools",
	});

export type ListingToolQuerySchema = typeof ListingToolQuerySchema;

export namespace ListingToolQuerySchema {
	export type Type = z.infer<ListingToolQuerySchema>;
}
