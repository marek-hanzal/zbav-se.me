import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/@buyer-user/transaction/schema/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";

export const TransactionStatusCreateSchema = z
	.looseObject({
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
	.strip()
	.openapi("TransactionStatusCreate", {
		description: "Request to create a transaction status",
	});

export type TransactionStatusCreateSchema = typeof TransactionStatusCreateSchema;

export namespace TransactionStatusCreateSchema {
	export type Type = z.infer<TransactionStatusCreateSchema>;
}
