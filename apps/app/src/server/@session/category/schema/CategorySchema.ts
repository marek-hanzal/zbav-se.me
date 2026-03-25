import { z } from "@hono/zod-openapi";
import { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";

export const CategorySchema = z
	.looseObject({
		...CategoryTableSchema.shape,
	})
	.strip()
	.openapi("Category", {
		description: "Category data",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
