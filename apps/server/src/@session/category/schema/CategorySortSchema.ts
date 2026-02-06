import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const CategorySortSchema = z
	.looseObject({
		field: z
			.enum([
				"group",
				"category",
				"sort",
			])
			.openapi("CategorySortField", {
				description: "Field of the category sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("CategorySort", {
		description: "Sort object for category collection",
	});

export type CategorySortSchema = typeof CategorySortSchema;

export namespace CategorySortSchema {
	export type Type = z.infer<CategorySortSchema>;
}
