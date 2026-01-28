import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryMissFilterSchema } from "~/@session/category-miss/schema/CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "~/@session/category-miss/schema/CategoryMissSortSchema";
import { CategoryMissWhereSchema } from "~/@session/category-miss/schema/CategoryMissWhereSchema";

export const CategoryMissQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryMissFilterSchema.optional(),
		where: CategoryMissWhereSchema.optional(),
		sort: CategoryMissSortSchema.array().optional(),
	})
	.strip()
	.openapi("CategoryMissQuery", {
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
