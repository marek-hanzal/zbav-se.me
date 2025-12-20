import { z } from "@hono/zod-openapi";
import { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import { ListingWhereSchema } from "~/@user/listing/schema/ListingWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingFilterSchema } from "./ListingFilterSchema";
import { ListingSortSchema } from "./ListingSortSchema";

export const ListingQuerySchema = z
	.object({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
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
