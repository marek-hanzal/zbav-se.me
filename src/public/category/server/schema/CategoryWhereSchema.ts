import { z } from "zod";
import { CategoryFilterSchema } from "~/public/category/server/schema/CategoryFilterSchema";

export const CategoryWhereSchema = z
	.looseObject({
		...CategoryFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicCategoryWhere",
		description: "Public category filters",
	});

export type CategoryWhereSchema = typeof CategoryWhereSchema;

export namespace CategoryWhereSchema {
	export type Type = z.infer<CategoryWhereSchema>;
}
