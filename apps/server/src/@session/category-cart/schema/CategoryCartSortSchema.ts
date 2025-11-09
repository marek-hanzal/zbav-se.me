import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";
import { CategorySortSchema } from "../../category/schema/CategorySortSchema";

export const CategoryCartSortSchema = z
	.object({
		value: z.enum([
			...CategorySortSchema.shape.value.options,
			"listingCount",
		]),
		sort: OrderSchema,
	})
	.openapi("CategoryCartSort", {
		description: "Sort object for category cart collection",
	});

export type CategoryCartSortSchema = typeof CategoryCartSortSchema;

export namespace CategoryCartSortSchema {
	export type Type = z.infer<typeof CategoryCartSortSchema>;
}
