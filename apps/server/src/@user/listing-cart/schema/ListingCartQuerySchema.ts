import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingCartFilterSchema } from "./ListingCartFilterSchema";
import { ListingCartSortSchema } from "./ListingCartSortSchema";

export const ListingCartQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingCartFilterSchema.optional(),
		where: ListingCartFilterSchema.openapi("ListingCartWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingCartSortSchema.array().optional(),
	})
	.openapi("ListingCartQuery", {
		description: "Query object for listing cart collection",
	});

export type ListingCartQuerySchema = typeof ListingCartQuerySchema;

export namespace ListingCartQuerySchema {
	export type Type = z.infer<ListingCartQuerySchema>;
}
