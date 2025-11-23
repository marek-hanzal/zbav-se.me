import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "../../../schema/OrderEnumSchema";

export const ListingTransactionSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
				"expiresAt",
			])
			.openapi("ListingTransactionSortField", {
				description: "Field of the listing transaction sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingTransactionSort", {
		description: "Sort object for listing transaction collection",
	});

export type ListingTransactionSortSchema = typeof ListingTransactionSortSchema;

export namespace ListingTransactionSortSchema {
	export type Type = z.infer<ListingTransactionSortSchema>;
}
