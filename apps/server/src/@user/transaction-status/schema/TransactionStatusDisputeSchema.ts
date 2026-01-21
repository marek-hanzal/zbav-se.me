import { z } from "@hono/zod-openapi";

export const TransactionStatusDisputeSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to dispute",
		}),
	})
	.strip()
	.openapi("TransactionStatusDispute", {
		description: "Request to dispute a listing transaction",
	});

export type TransactionStatusDisputeSchema = typeof TransactionStatusDisputeSchema;

export namespace TransactionStatusDisputeSchema {
	export type Type = z.infer<TransactionStatusDisputeSchema>;
}
