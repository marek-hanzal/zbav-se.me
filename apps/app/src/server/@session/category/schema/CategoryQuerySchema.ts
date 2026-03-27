import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { CategoryFilterSchema } from "~/server/@session/category/schema/CategoryFilterSchema";
import { CategorySortSchema } from "~/server/@session/category/schema/CategorySortSchema";
import { CategoryWhereSchema } from "~/server/@session/category/schema/CategoryWhereSchema";

export const CategoryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryFilterSchema.optional(),
		where: CategoryWhereSchema.optional(),
		sort: CategorySortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "CategoryQuery",
		description: "Category query parameters",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<CategoryQuerySchema>;
}
