import { z } from "zod";
import { CategoryFilterSchema } from "~/server/@session/category/schema/CategoryFilterSchema";

export const CategoryWhereSchema = z
	.looseObject({
		...CategoryFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "CategoryWhere",
		description: "App-based filters",
	});

export type CategoryWhereSchema = typeof CategoryWhereSchema;

export namespace CategoryWhereSchema {
	export type Type = z.infer<CategoryWhereSchema>;
}
