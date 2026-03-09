import { z } from "@hono/zod-openapi";
import { TransactionEntryTextValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryTextValueSchema";

export const TransactionEntryTextCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		kind: z.literal("text"),
		payload: TransactionEntryTextValueSchema,
	})
	.openapi("TransactionEntryTextCreate");

export type TransactionEntryTextCreateSchema = typeof TransactionEntryTextCreateSchema;

export namespace TransactionEntryTextCreateSchema {
	export type Type = z.infer<TransactionEntryTextCreateSchema>;
}
