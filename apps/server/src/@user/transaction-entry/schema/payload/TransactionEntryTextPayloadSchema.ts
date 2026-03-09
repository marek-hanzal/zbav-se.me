import { z } from "@hono/zod-openapi";
import { TransactionEntryTextValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryTextValueSchema";

export const TransactionEntryTextPayloadSchema = z
	.looseObject({
		kind: z.literal("text"),
		payload: TransactionEntryTextValueSchema,
	})
	.openapi("TransactionEntryTextPayload");

export type TransactionEntryTextPayloadSchema = typeof TransactionEntryTextPayloadSchema;

export namespace TransactionEntryTextPayloadSchema {
	export type Type = z.infer<TransactionEntryTextPayloadSchema>;
}
