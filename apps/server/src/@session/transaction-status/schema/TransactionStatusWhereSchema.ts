import { z } from "@hono/zod-openapi";
import { TransactionStatusFilterSchema } from "~/@session/transaction-status/schema/TransactionStatusFilterSchema";

export const TransactionStatusWhereSchema = z
	.object({
		...TransactionStatusFilterSchema.shape,
	})
	.openapi("TransactionStatusWhere", {
		description: "App-based filters",
	});

export type TransactionStatusWhereSchema = typeof TransactionStatusWhereSchema;

export namespace TransactionStatusWhereSchema {
	export type Type = z.infer<TransactionStatusWhereSchema>;
}
