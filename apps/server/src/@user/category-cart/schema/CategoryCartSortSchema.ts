import { z } from "@hono/zod-openapi";
import { CategorySortSchema } from "../../../@session/category/schema/CategorySortSchema";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const CategoryCartSortSchema = z
	.object({
		field: z
			.enum([
				...CategorySortSchema.shape.field.options,
				"listingCount",
			])
			.openapi("CategoryCartSortField", {
				description: "Field of the category cart sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("CategoryCartSort", {
		description: "Sort object for category cart collection",
	});

export type CategoryCartSortSchema = typeof CategoryCartSortSchema;

export namespace CategoryCartSortSchema {
	export type Type = z.infer<CategoryCartSortSchema>;
}
