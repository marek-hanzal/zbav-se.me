import { z } from "@hono/zod-openapi";

export const CategoryGroupSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the category group",
		}),
		name: z.string().openapi({
			description: "Name of the category group",
		}),
		sort: z.number().openapi({
			description: "Sort order (position) of the category group",
		}),
		locale: z.string().openapi({
			description: "Locale/language of the category group",
		}),
	})
	.openapi("CategoryGroup", {
		description:
			"Represents a group of categories a listing can be assigned to",
	});

export type CategoryGroupSchema = typeof CategoryGroupSchema;

export namespace CategoryGroupSchema {
	export type Type = z.infer<CategoryGroupSchema>;
}
