import { z } from "zod";

export const CategoryMissTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the category miss entry",
		}),
		category: z.string().meta({
			description: "Category name that was missed",
		}),
		updatedAt: z.date().meta({
			description: "Last updated timestamp",
		}),
		count: z.number().meta({
			description: "Count of misses for this category",
		}),
	})
	.meta({
		id: "CategoryMissTable",
		description: "Database row for a missing category suggestion.",
	})
	.strip();

export type CategoryMissTableSchema = typeof CategoryMissTableSchema;

export namespace CategoryMissTableSchema {
	export type Type = z.infer<CategoryMissTableSchema>;
}
