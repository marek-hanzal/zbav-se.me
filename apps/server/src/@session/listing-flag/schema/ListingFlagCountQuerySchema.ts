import { z } from "@hono/zod-openapi";
import { ListingFlagFilterSchema } from "./ListingFlagFilterSchema";

export const ListingFlagCountQuerySchema = z
	.object({
		filter: ListingFlagFilterSchema.optional(),
		where: ListingFlagFilterSchema.openapi("ListingFlagCountWhere", {
			description: "App-based filters",
		}).optional(),
	})
	.openapi("ListingFlagCountQuery", {
		description: "Query object for listing flag counts",
	});

export type ListingFlagCountQuerySchema = typeof ListingFlagCountQuerySchema;

export namespace ListingFlagCountQuerySchema {
	export type Type = z.infer<ListingFlagCountQuerySchema>;
}
