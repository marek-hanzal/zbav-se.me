import { z } from "@hono/zod-openapi";
import { OrderSchema } from "~/schema/OrderSchema";

export const CategoryMissSortSchema = z
	.object({
		field: z
			.enum([
				"category",
				"count",
				"updatedAt",
			])
			.openapi("CategoryMissSortField", {
				description: "Field for category miss sort",
			}),
		direction: OrderSchema,
	})
	.openapi("CategoryMissSort", {
		description: "Data for category miss sort",
	});

export type CategoryMissSortSchema = typeof CategoryMissSortSchema;

export namespace CategoryMissSortSchema {
	export type Type = z.infer<CategoryMissSortSchema>;
}
