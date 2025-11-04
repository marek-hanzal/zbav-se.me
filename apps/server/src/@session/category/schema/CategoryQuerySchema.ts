import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { CategoryFilterSchema } from "./CategoryFilterSchema";
import { CategorySortSchema } from "./CategorySortSchema";

export const CategoryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: CategoryFilterSchema.optional(),
		where: CategoryFilterSchema.openapi("CategoryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: CategorySortSchema.array().optional(),
	})
	.openapi("CategoryQuery", {
		description: "Query object for category collection",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<typeof CategoryQuerySchema>;
}
