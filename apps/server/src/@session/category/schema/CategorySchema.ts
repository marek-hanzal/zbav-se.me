import { z } from "@hono/zod-openapi";
import { CategoryDbSchema } from "../../../app/category/schema/CategoryDbSchema";

export const CategorySchema = z
	.object({
		...CategoryDbSchema.shape,
	})
	.openapi("Category", {
		description: "Category data",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
