import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const CategorySortSchema = z
	.looseObject({
		field: z
			.enum([
				"group",
				"category",
				"sort",
			])
			.meta({
				id: "PublicCategorySortField",
				description: "Field of the public category sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "PublicCategorySort",
		description: "Sort object for public category collection",
	});

export type CategorySortSchema = typeof CategorySortSchema;

export namespace CategorySortSchema {
	export type Type = z.infer<CategorySortSchema>;
}
