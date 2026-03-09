import { z } from "@hono/zod-openapi";
import { TransactionEntryPersonalValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPersonalValueSchema";

export const TransactionEntryPersonalPayloadSchema = z
	.looseObject({
		kind: z.literal("personal"),
		payload: TransactionEntryPersonalValueSchema,
	})
	.openapi("TransactionEntryPersonalPayload");

export type TransactionEntryPersonalPayloadSchema = typeof TransactionEntryPersonalPayloadSchema;

export namespace TransactionEntryPersonalPayloadSchema {
	export type Type = z.infer<TransactionEntryPersonalPayloadSchema>;
}
