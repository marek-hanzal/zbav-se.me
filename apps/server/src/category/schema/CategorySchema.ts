import { z } from "@hono/zod-openapi";

export const CategorySchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the category",
		}),
		group: z.string().openapi({
			description: "Group/name of the category",
		}),
		category: z.string().openapi({
			description: "Category name within the group",
		}),
		slug: z.string().openapi({
			description: "Slug of the category",
		}),
		sort: z.number().openapi({
			description: "Sort order (position) of the category",
		}),
		locale: z.string().openapi({
			description: "Locale/language of the category",
		}),
	})
	.openapi("Category", {
		description: "Represents a category a listing can be assigned to",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
