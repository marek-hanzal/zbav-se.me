import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { CategoryMissFilterSchema } from "~/server/@session/category-miss/schema/CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "~/server/@session/category-miss/schema/CategoryMissSortSchema";
import { CategoryMissWhereSchema } from "~/server/@session/category-miss/schema/CategoryMissWhereSchema";

export const CategoryMissQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryMissFilterSchema.optional(),
		where: CategoryMissWhereSchema.optional(),
		sort: CategoryMissSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "CategoryMissQuery",
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
