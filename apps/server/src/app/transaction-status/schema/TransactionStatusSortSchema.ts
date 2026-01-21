import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionStatusSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("TransactionStatusSortField", {
				description: "Available sort fields for listing transaction status",
			}),
		direction: OrderEnumSchema,
	})
	.strip()
	.openapi("TransactionStatusSort", {
		description: "Sort parameters for listing transaction status collection",
	});

export type TransactionStatusSortSchema = typeof TransactionStatusSortSchema;

export namespace TransactionStatusSortSchema {
	export type Type = z.infer<TransactionStatusSortSchema>;
}
