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
				id: "CategorySortField",
				description: "Field of the category sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "CategorySort",
		description: "Sort object for category collection",
	});

export type CategorySortSchema = typeof CategorySortSchema;

export namespace CategorySortSchema {
	export type Type = z.infer<CategorySortSchema>;
}
