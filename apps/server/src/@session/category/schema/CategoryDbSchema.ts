import { z } from "@hono/zod-openapi";

export const CategoryDbSchema = z.object({
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
});

export type CategoryDbSchema = typeof CategoryDbSchema;

export namespace CategoryDbSchema {
	export type Type = z.infer<CategoryDbSchema>;
}
