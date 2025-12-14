import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { CategoryMissFilterSchema } from "./CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "./CategoryMissSortSchema";

export const CategoryMissQuerySchema = z.object({
	cursor: z.union([
		CursorSchema,
		z.null(),
	]),
	filter: z.union([
		CategoryMissFilterSchema,
		z.null(),
	]),
	where: z.union([
		CategoryMissFilterSchema.openapi("CategoryMissWhere", {
			description: "App-based filters for category miss tracking",
		}),
		z.null(),
	]),
	sort: z.union([
		CategoryMissSortSchema.array(),
		z.null(),
	]),
});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
