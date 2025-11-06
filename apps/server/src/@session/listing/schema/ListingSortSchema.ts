import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const ListingSortSchema = z
	.object({
		value: z.enum([
			"price",
			"condition",
			"age",
			"createdAt",
			"updatedAt",
			"expiresAt",
			// "embedding",
			"geo",
		]),
		sort: OrderSchema,
	})
	.openapi("ListingSort", {
		description: "Sort object for listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}
