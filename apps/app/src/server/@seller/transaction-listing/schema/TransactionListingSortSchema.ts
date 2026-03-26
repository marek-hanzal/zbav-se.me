import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const TransactionListingSortSchema = z
	.looseObject({
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
	.strip()
	.openapi("TransactionListingSort", {
		description: "Sort object for transaction-listing collection",
	});

export type TransactionListingSortSchema = typeof TransactionListingSortSchema;

export namespace TransactionListingSortSchema {
	export type Type = z.infer<TransactionListingSortSchema>;
}
