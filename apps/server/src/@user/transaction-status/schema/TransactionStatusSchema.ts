import { z } from "@hono/zod-openapi";
import { TransactionStatusDbSchema } from "~/app/transaction-status/schema/ListingTransactionStatusDbSchema";

export const TransactionStatusSchema = z
	.object({
		...TransactionStatusDbSchema.shape,
	})
	.omit({
		createdAt: true,
	})
	.openapi("TransactionStatus", {
		description: "Listing transaction status entry",
	});

export type TransactionStatusSchema = typeof TransactionStatusSchema;

export namespace TransactionStatusSchema {
	export type Type = z.infer<TransactionStatusSchema>;
}
