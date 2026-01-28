import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryFilterSchema } from "~/@session/category/schema/CategoryFilterSchema";
import { CategorySortSchema } from "~/@session/category/schema/CategorySortSchema";
import { CategoryWhereSchema } from "~/@session/category/schema/CategoryWhereSchema";

export const CategoryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryFilterSchema.optional(),
		where: CategoryWhereSchema.optional(),
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
