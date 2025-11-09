import { z } from "@hono/zod-openapi";
import { CategoryQuerySchema } from "../../category/schema/CategoryQuerySchema";
import { CategoryCartSortSchema } from "./CategoryCartSortSchema";

export const CategoryCartQuerySchema = z
	.object({
		...CategoryQuerySchema.omit({
			sort: true,
		}).shape,
		sort: CategoryCartSortSchema.array().optional(),
	})
	.openapi("CategoryCartQuery", {
		description: "Query object for category cart collection",
	});

export type CategoryCartQuerySchema = typeof CategoryCartQuerySchema;

export namespace CategoryCartQuerySchema {
	export type Type = z.infer<typeof CategoryCartQuerySchema>;
}
