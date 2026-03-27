import { z } from "zod";
import { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";

export const CategoryItemSchema = z
	.looseObject({
		...CategoryTableSchema.shape,
	})
	.strip()
	.meta({
		id: "CategoryItem",
		description: "Category collection item",
	});

export type CategoryItemSchema = typeof CategoryItemSchema;

export namespace CategoryItemSchema {
	export type Type = z.infer<CategoryItemSchema>;
}
