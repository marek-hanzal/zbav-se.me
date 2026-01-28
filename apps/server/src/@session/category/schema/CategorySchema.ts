import { z } from "@hono/zod-openapi";
import { CategoryTableSchema } from "~/database/@table/CategoryTableSchema";

export const CategorySchema = z
	.object({
		...CategoryTableSchema.shape,
	})
	.openapi("Category", {
		description: "Category data",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
