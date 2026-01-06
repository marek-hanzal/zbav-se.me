import type { z } from "@hono/zod-openapi";
import { CategoryQuerySchema } from "./CategoryQuerySchema";

export const CategoryCountQuerySchema = CategoryQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("CategoryCountQuery", {
	description: "Query object for category count",
});

export type CategoryCountQuerySchema = typeof CategoryCountQuerySchema;

export namespace CategoryCountQuerySchema {
	export type Type = z.infer<CategoryCountQuerySchema>;
}
