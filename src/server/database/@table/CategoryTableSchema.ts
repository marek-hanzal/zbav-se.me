import { z } from "zod";

export const CategoryTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the category",
		}),
		group: z.string().meta({
			description: "Group/name of the category",
		}),
		category: z.string().meta({
			description: "Category name within the group",
		}),
		slug: z.string().meta({
			description: "Slug of the category",
		}),
		sort: z.number().meta({
			description: "Sort order (position) of the category",
		}),
		locale: z.string().meta({
			description: "Locale/language of the category",
		}),
	})
	.meta({
		id: "CategoryTable",
		description: "Database row for a category.",
	})
	.strip();

export type CategoryTableSchema = typeof CategoryTableSchema;

export namespace CategoryTableSchema {
	export type Type = z.infer<CategoryTableSchema>;
}
