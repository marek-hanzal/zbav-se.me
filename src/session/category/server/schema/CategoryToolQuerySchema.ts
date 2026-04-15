import { z } from "zod";
import { CategoryQuerySchema } from "./CategoryQuerySchema";
import { CategoryToolFilterSchema } from "./CategoryToolFilterSchema";

export const CategoryToolQuerySchema = z
	.looseObject({
		...CategoryQuerySchema.shape,
		filter: CategoryToolFilterSchema.optional(),
		where: CategoryToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "CategoryToolQuery",
		description: "Query object for category tools",
	});

export type CategoryToolQuerySchema = typeof CategoryToolQuerySchema;

export namespace CategoryToolQuerySchema {
	export type Type = z.infer<CategoryToolQuerySchema>;
}
