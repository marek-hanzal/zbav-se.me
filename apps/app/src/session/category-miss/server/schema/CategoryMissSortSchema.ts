import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const CategoryMissSortSchema = z
	.looseObject({
		field: z
			.enum([
				"category",
				"count",
				"updatedAt",
			])
			.meta({
				id: "CategoryMissSortField",
				description: "Field for category miss sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "CategoryMissSort",
		description: "Data for category miss sort",
	});

export type CategoryMissSortSchema = typeof CategoryMissSortSchema;

export namespace CategoryMissSortSchema {
	export type Type = z.infer<CategoryMissSortSchema>;
}
