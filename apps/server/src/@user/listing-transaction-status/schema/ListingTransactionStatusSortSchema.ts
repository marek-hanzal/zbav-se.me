import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ListingTransactionStatusSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingTransactionStatusSortField", {
				description: "Available sort fields for listing transaction status",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("ListingTransactionStatusSort", {
		description: "Sort parameters for listing transaction status collection",
	});

export type ListingTransactionStatusSortSchema = typeof ListingTransactionStatusSortSchema;

export namespace ListingTransactionStatusSortSchema {
	export type Type = z.infer<ListingTransactionStatusSortSchema>;
}
