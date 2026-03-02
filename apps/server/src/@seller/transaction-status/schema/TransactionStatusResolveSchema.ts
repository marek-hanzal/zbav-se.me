import { z } from "@hono/zod-openapi";

export const TransactionStatusResolveSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "The ID of the listing transaction to resolve",
		}),
	})
	.strip()
	.openapi("TransactionStatusResolve", {
		description: "Request to resolve a listing transaction",
	});

export type TransactionStatusResolveSchema = typeof TransactionStatusResolveSchema;

export namespace TransactionStatusResolveSchema {
	export type Type = z.infer<TransactionStatusResolveSchema>;
}
