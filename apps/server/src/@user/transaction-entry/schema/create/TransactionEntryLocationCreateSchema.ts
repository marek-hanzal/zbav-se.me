import { z } from "@hono/zod-openapi";
import { TransactionEntryLocationValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryLocationValueSchema";

export const TransactionEntryLocationCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		kind: z.literal("location"),
		payload: TransactionEntryLocationValueSchema,
	})
	.openapi("TransactionEntryLocationCreate");

export type TransactionEntryLocationCreateSchema = typeof TransactionEntryLocationCreateSchema;

export namespace TransactionEntryLocationCreateSchema {
	export type Type = z.infer<TransactionEntryLocationCreateSchema>;
}
