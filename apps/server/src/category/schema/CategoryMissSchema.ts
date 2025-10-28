import { z } from "@hono/zod-openapi";

export const CategoryMissSchema = z
	.object({
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
	.openapi("CategoryMiss", {
		description:
			"Represents tracking of missed category searches or interactions",
	});

export type CategoryMissSchema = typeof CategoryMissSchema;

export namespace CategoryMissSchema {
	export type Type = z.infer<CategoryMissSchema>;
}
