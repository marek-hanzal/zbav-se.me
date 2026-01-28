import { z } from "@hono/zod-openapi";
import { CategoryFilterSchema } from "~/@session/category/schema/CategoryFilterSchema";

export const CategoryWhereSchema = z
	.object({
		...CategoryFilterSchema.shape,
	})
	.openapi("CategoryWhere", {
		description: "App-based filters",
	});

export type CategoryWhereSchema = typeof CategoryWhereSchema;

export namespace CategoryWhereSchema {
	export type Type = z.infer<CategoryWhereSchema>;
}
