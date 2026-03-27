import { z } from "zod";
import { CategoryMissFilterSchema } from "~/server/@session/category-miss/schema/CategoryMissFilterSchema";

export const CategoryMissWhereSchema = z
	.looseObject({
		...CategoryMissFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "CategoryMissWhere",
		description: "App-based filters",
	});

export type CategoryMissWhereSchema = typeof CategoryMissWhereSchema;

export namespace CategoryMissWhereSchema {
	export type Type = z.infer<CategoryMissWhereSchema>;
}
