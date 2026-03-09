import { z } from "@hono/zod-openapi";
import { TransactionEntryLocationValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryLocationValueSchema";

export const TransactionEntryLocationPayloadSchema = z
	.looseObject({
		kind: z.literal("location"),
		payload: TransactionEntryLocationValueSchema,
	})
	.openapi("TransactionEntryLocationPayload");

export type TransactionEntryLocationPayloadSchema = typeof TransactionEntryLocationPayloadSchema;

export namespace TransactionEntryLocationPayloadSchema {
	export type Type = z.infer<TransactionEntryLocationPayloadSchema>;
}
