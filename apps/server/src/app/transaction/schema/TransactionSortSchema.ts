import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
				"expiresAt",
			])
			.openapi("TransactionSortField", {
				description: "Field of the transaction sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("TransactionSort", {
		description: "Sort object for transaction collection",
	});

export type TransactionSortSchema = typeof TransactionSortSchema;

export namespace TransactionSortSchema {
	export type Type = z.infer<TransactionSortSchema>;
}
