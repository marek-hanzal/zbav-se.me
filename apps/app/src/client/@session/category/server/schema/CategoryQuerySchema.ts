import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { CategoryFilterSchema } from "~/client/@session/category/server/schema/CategoryFilterSchema";
import { CategorySortSchema } from "~/client/@session/category/server/schema/CategorySortSchema";
import { CategoryWhereSchema } from "~/client/@session/category/server/schema/CategoryWhereSchema";

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
