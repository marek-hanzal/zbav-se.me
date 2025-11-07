import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingIgnoreFilterSchema } from "./ListingIgnoreFilterSchema";
import { ListingIgnoreSortSchema } from "./ListingIgnoreSortSchema";

export const ListingIgnoreQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingIgnoreFilterSchema.optional(),
		where: ListingIgnoreFilterSchema.openapi("ListingIgnoreWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingIgnoreSortSchema.array().optional(),
	})
	.openapi("ListingIgnoreQuery", {
		description: "Query object for listing ignore collection",
	});

export type ListingIgnoreQuerySchema = typeof ListingIgnoreQuerySchema;

export namespace ListingIgnoreQuerySchema {
	export type Type = z.infer<ListingIgnoreQuerySchema>;
}
