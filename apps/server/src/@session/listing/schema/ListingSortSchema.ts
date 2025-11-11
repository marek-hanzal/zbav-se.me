import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const ListingSortSchema = z
	.object({
		field: z
			.enum([
				"price",
				"condition",
				"age",
				"createdAt",
				"updatedAt",
				"expiresAt",
				"geo",
			])
			.openapi("ListingSortField", {
				description: "Field of the listing sort",
			}),
		direction: OrderSchema,
	})
	.openapi("ListingSort", {
		description: "Sort object for listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}
