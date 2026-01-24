import { z } from "@hono/zod-openapi";

export const CategoryMissDbSchema = z.object({
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
});

export type CategoryMissDbSchema = typeof CategoryMissDbSchema;

export namespace CategoryMissDbSchema {
	export type Type = z.infer<CategoryMissDbSchema>;
}
