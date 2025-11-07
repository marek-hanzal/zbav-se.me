import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { ListingFlagFilterSchema } from "./ListingFlagFilterSchema";
import { ListingFlagSortSchema } from "./ListingFlagSortSchema";

export const ListingFlagQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: ListingFlagFilterSchema.optional(),
		where: ListingFlagFilterSchema.openapi("ListingFlagWhere", {
			description: "App-based filters",
		}).optional(),
		sort: ListingFlagSortSchema.array().optional(),
	})
	.openapi("ListingFlagQuery", {
		description: "Query object for listing flag collection",
	});

export type ListingFlagQuerySchema = typeof ListingFlagQuerySchema;

export namespace ListingFlagQuerySchema {
	export type Type = z.infer<ListingFlagQuerySchema>;
}
