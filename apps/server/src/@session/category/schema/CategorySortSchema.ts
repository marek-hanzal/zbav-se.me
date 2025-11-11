import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const CategorySortSchema = z
	.object({
		field: z
			.enum([
				"group",
				"category",
				"sort",
			])
			.openapi("CategorySortField", {
				description: "Field of the category sort",
			}),
		direction: OrderSchema,
	})
	.openapi("CategorySort", {
		description: "Sort object for category collection",
	});

export type CategorySortSchema = typeof CategorySortSchema;

export namespace CategorySortSchema {
	export type Type = z.infer<CategorySortSchema>;
}
