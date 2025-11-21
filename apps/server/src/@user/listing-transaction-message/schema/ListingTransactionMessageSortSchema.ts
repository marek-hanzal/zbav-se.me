import { z } from "@hono/zod-openapi";
import { OrderSchema } from "~/schema/OrderSchema";

export const ListingTransactionMessageSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("ListingTransactionMessageSortField", {
				description: "Available sort fields for listing transaction message",
			}),
		direction: OrderSchema,
	})
	.openapi("ListingTransactionMessageSort", {
		description: "Sort parameters for listing transaction message collection",
	});

export type ListingTransactionMessageSortSchema = typeof ListingTransactionMessageSortSchema;

export namespace ListingTransactionMessageSortSchema {
	export type Type = z.infer<ListingTransactionMessageSortSchema>;
}
