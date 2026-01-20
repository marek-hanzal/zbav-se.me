import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryFilterSchema } from "./CategoryFilterSchema";
import { CategorySortSchema } from "./CategorySortSchema";

export const CategoryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryFilterSchema.optional(),
		where: CategoryFilterSchema.openapi("CategoryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: CategorySortSchema.array().optional(),
	})
	.strip()
	.openapi("CategoryQuery", {
		description: "Category query parameters",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<CategoryQuerySchema>;
}
