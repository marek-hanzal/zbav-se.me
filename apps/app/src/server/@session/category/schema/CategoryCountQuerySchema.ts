import { z } from "@hono/zod-openapi";
import { CategoryQuerySchema } from "~/server/@session/category/schema/CategoryQuerySchema";

export const CategoryCountQuerySchema = z
	.looseObject({
		...CategoryQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("CategoryCountQuery", {
		description: "Query object for category count",
	});

export type CategoryCountQuerySchema = typeof CategoryCountQuerySchema;

export namespace CategoryCountQuerySchema {
	export type Type = z.infer<CategoryCountQuerySchema>;
}
