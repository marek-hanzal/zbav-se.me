import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { CategoryMissFilterSchema } from "~/@session/category-miss/server/schema/CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "~/@session/category-miss/server/schema/CategoryMissSortSchema";
import { CategoryMissWhereSchema } from "~/@session/category-miss/server/schema/CategoryMissWhereSchema";

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
