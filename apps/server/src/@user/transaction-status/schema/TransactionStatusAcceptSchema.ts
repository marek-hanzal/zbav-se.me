import { z } from "zod";

export const TransactionStatusAcceptSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to accept",
		}),
	})
	.openapi("TransactionStatusAccept", {
		description: "Request to accept a listing transaction",
	});

export type TransactionStatusAcceptSchema = typeof TransactionStatusAcceptSchema;

export namespace TransactionStatusAcceptSchema {
	export type Type = z.infer<TransactionStatusAcceptSchema>;
}
