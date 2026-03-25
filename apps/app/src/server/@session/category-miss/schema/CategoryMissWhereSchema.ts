import { z } from "@hono/zod-openapi";
import { CategoryMissFilterSchema } from "~/server/@session/category-miss/schema/CategoryMissFilterSchema";

export const CategoryMissWhereSchema = z
	.looseObject({
		...CategoryMissFilterSchema.shape,
	})
	.strip()
	.openapi("CategoryMissWhere", {
		description: "App-based filters",
	});

export type CategoryMissWhereSchema = typeof CategoryMissWhereSchema;

export namespace CategoryMissWhereSchema {
	export type Type = z.infer<CategoryMissWhereSchema>;
}
