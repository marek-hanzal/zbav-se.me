import { z } from "@hono/zod-openapi";

export const TransactionStatusAcceptSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to accept",
		}),
	})
	.strip()
	.openapi("TransactionStatusAccept", {
		description: "Request to accept a listing transaction",
	});

export type TransactionStatusAcceptSchema = typeof TransactionStatusAcceptSchema;

export namespace TransactionStatusAcceptSchema {
	export type Type = z.infer<TransactionStatusAcceptSchema>;
}
