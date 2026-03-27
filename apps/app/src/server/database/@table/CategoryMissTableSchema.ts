import { z } from "@hono/zod-openapi";

export const CategoryMissTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the category miss entry",
		}),
		category: z.string().openapi({
			description: "Category name that was missed",
		}),
		updatedAt: z.date().openapi({
			description: "Last updated timestamp",
		}),
		count: z.number().openapi({
			description: "Count of misses for this category",
		}),
	})
	.strip();

export type CategoryMissTableSchema = typeof CategoryMissTableSchema;

export namespace CategoryMissTableSchema {
	export type Type = z.infer<CategoryMissTableSchema>;
}
