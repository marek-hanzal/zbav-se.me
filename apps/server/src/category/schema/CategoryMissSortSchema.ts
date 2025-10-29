import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const CategoryMissSortSchema = z
	.object({
		value: z.enum([
			"category",
			"count",
			"updatedAt",
		]),
		sort: OrderSchema,
	})
	.openapi("CategoryMissSort", {
		description: "Sort object for category miss collection",
	});

export type CategoryMissSortSchema = typeof CategoryMissSortSchema;

export namespace CategoryMissSortSchema {
	export type Type = z.infer<CategoryMissSortSchema>;
}
