import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/ListingTransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/ListingTransactionStatusEnumSchema";

export const TransactionStatusCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction",
		}),
		status: TransactionStatusEnumSchema.openapi({
			description: "The status to set",
		}),
		side: TransactionSideEnumSchema.openapi({
			description: "The side that initiated this status change",
		}),
	})
	.openapi("TransactionStatusCreate", {
		description: "Request to create a transaction status",
	});

export type TransactionStatusCreateSchema = typeof TransactionStatusCreateSchema;

export namespace TransactionStatusCreateSchema {
	export type Type = z.infer<TransactionStatusCreateSchema>;
}
