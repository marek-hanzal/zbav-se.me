import { z } from "@hono/zod-openapi";

export const TransactionStatusRejectSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to reject",
		}),
	})
	.openapi("TransactionStatusReject", {
		description: "Request to reject a listing transaction",
	});

export type TransactionStatusRejectSchema = typeof TransactionStatusRejectSchema;

export namespace TransactionStatusRejectSchema {
	export type Type = z.infer<TransactionStatusRejectSchema>;
}
