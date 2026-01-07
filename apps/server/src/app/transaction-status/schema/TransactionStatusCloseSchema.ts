import { z } from "@hono/zod-openapi";

export const TransactionStatusCloseSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to close",
		}),
	})
	.openapi("TransactionStatusClose", {
		description: "Request to close a listing transaction",
	});

export type TransactionStatusCloseSchema = typeof TransactionStatusCloseSchema;

export namespace TransactionStatusCloseSchema {
	export type Type = z.infer<TransactionStatusCloseSchema>;
}
