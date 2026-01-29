import { z } from "@hono/zod-openapi";
import { CategoryMissFilterSchema } from "~/@session/category-miss/schema/CategoryMissFilterSchema";

export const CategoryMissWhereSchema = z
	.object({
		...CategoryMissFilterSchema.shape,
	})
	.openapi("CategoryMissWhere", {
		description: "App-based filters",
	});

export type CategoryMissWhereSchema = typeof CategoryMissWhereSchema;

export namespace CategoryMissWhereSchema {
	export type Type = z.infer<CategoryMissWhereSchema>;
}
