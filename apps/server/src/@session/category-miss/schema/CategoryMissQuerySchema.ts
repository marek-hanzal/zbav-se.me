import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryMissFilterSchema } from "./CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "./CategoryMissSortSchema";

export const CategoryMissQuerySchema = z.object({
	cursor: CursorSchema.nullish(),
	filter: CategoryMissFilterSchema.nullish(),
	where: CategoryMissFilterSchema.openapi("CategoryMissWhere", {
		description: "App-based filters for category miss tracking",
	}).nullish(),
	sort: CategoryMissSortSchema.array().nullish(),
});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
