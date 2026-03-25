import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const CategoryMissSortSchema = z
	.looseObject({
		field: z
			.enum([
				"category",
				"count",
				"updatedAt",
			])
			.openapi("CategoryMissSortField", {
				description: "Field for category miss sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("CategoryMissSort", {
		description: "Data for category miss sort",
	});

export type CategoryMissSortSchema = typeof CategoryMissSortSchema;

export namespace CategoryMissSortSchema {
	export type Type = z.infer<CategoryMissSortSchema>;
}
