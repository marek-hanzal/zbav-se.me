import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryMissFilterSchema } from "./CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "./CategoryMissSortSchema";

export const CategoryMissQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryMissFilterSchema.optional(),
		where: CategoryMissFilterSchema.optional().openapi("CategoryMissWhere", {
			description: "App-based filters for category miss tracking",
		}),
		sort: CategoryMissSortSchema.array().optional(),
	})
	.strip()
	.openapi("CategoryMissQuery", {
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
