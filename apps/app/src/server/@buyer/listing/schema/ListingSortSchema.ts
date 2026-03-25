import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const ListingSortSchema = z
	.looseObject({
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
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("ListingSort", {
		description: "Sort object for listing collection",
	});

export type ListingSortSchema = typeof ListingSortSchema;

export namespace ListingSortSchema {
	export type Type = z.infer<ListingSortSchema>;
}
