import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../../schema/CursorSchema";
import { CategoryMissFilterSchema } from "./CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "./CategoryMissSortSchema";

export const CategoryMissQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: CategoryMissFilterSchema.nullish(),
		where: CategoryMissFilterSchema.openapi("CategoryMissWhere", {
			description: "App-based filters for category miss tracking",
		}).nullish(),
		sort: CategoryMissSortSchema.array().nullish(),
	})
	.openapi("CategoryMissQuery", {
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<typeof CategoryMissQuerySchema>;
}
