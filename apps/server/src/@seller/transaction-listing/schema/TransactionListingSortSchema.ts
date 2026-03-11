import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionListingSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"lastAt",
			])
			.openapi("TransactionListingSortField", {
				description: "Field of the transaction-listing sort",
			}),
		order: OrderEnumSchema,
	})
	.openapi("TransactionListingSort", {
		description: "Sort object for transaction-listing collection",
	});

export type TransactionListingSortSchema = typeof TransactionListingSortSchema;

export namespace TransactionListingSortSchema {
	export type Type = z.infer<TransactionListingSortSchema>;
}
