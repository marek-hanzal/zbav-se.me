import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../schema/CursorSchema";
import { ListingFilterSchema } from "./ListingFilterSchema";
import { ListingMetaSchema } from "./ListingMetaSchema";
import { ListingSortSchema } from "./ListingSortSchema";

export const ListingQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingFilterSchema.openapi("ListingWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
	})
	.openapi("ListingQuery", {
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<typeof ListingQuerySchema>;
}
