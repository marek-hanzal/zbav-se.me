import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const CategorySortSchema = z
	.object({
		value: z.enum([
			"group",
			"category",
			"sort",
		]),
		sort: OrderSchema,
	})
	.openapi("CategorySort", {
		description: "Sort object for category collection",
	});

export type CategorySortSchema = typeof CategorySortSchema;

export namespace CategorySortSchema {
	export type Type = z.infer<CategorySortSchema>;
}
