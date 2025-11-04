import { z } from "@hono/zod-openapi";
import { CategoryDbSchema } from "./CategoryDbSchema";

export const CategorySchema = z
	.object({
		...CategoryDbSchema.shape,
	})
	.openapi("Category", {
		description: "Category data transfer object",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
