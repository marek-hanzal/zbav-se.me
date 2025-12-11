import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingFilterSchema } from "./ListingFilterSchema";
import { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "./ListingSortSchema";
import { ListingWhereSchema } from "~/@user/listing/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingWhereSchema.optional().openapi("ListingWhere", {
			description: "App-based filters",
		}),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
	})
	.openapi("ListingQuery", {
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
