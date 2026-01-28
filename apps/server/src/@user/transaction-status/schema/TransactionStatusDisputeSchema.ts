import { z } from "@hono/zod-openapi";

/**
 * Dispute can be initiated by both seller and buyer, which is why it's located in the @common package.
 * However, since it's now moved to @user domain, it can be used by both buyer and seller user operations.
 */
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
