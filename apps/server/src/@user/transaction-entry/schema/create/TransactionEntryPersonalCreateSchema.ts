import { z } from "@hono/zod-openapi";
import { TransactionEntryPersonalValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPersonalValueSchema";

export const TransactionEntryPersonalCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		kind: z.literal("personal"),
		payload: TransactionEntryPersonalValueSchema,
	})
	.openapi("TransactionEntryPersonalCreate");

export type TransactionEntryPersonalCreateSchema = typeof TransactionEntryPersonalCreateSchema;

export namespace TransactionEntryPersonalCreateSchema {
	export type Type = z.infer<TransactionEntryPersonalCreateSchema>;
}
