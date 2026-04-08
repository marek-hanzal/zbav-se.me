import { z } from "zod";
import { ListingQuerySchema } from "./ListingQuerySchema";
import { ListingToolFilterSchema } from "./ListingToolFilterSchema";

export const ListingToolQuerySchema = z
	.looseObject({
		...ListingQuerySchema.shape,
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
