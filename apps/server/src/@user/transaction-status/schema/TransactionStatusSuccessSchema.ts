import { z } from "@hono/zod-openapi";

export const TransactionStatusSuccessSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to mark as successful",
		}),
	})
	.openapi("TransactionStatusSuccess", {
		description: "Request to mark a listing transaction as successful",
	});

export type TransactionStatusSuccessSchema = typeof TransactionStatusSuccessSchema;

export namespace TransactionStatusSuccessSchema {
	export type Type = z.infer<TransactionStatusSuccessSchema>;
}
