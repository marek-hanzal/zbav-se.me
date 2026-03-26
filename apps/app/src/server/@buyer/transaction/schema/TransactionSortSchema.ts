import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const TransactionSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
				"expiresAt",
				"lastAt",
				"status",
			])
			.openapi("TransactionSortField", {
				description: "Field of the transaction sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("TransactionSort", {
		description: "Sort object for transaction collection",
	});

export type TransactionSortSchema = typeof TransactionSortSchema;

export namespace TransactionSortSchema {
	export type Type = z.infer<TransactionSortSchema>;
}
