import { z } from "@hono/zod-openapi";
import { TransactionEntryStatusValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryStatusValueSchema";

export const TransactionEntryStatusPayloadSchema = z
	.looseObject({
		kind: z.enum([
			"status-pending",
			"status-open",
			"status-resolved",
			"status-dispute-buyer",
			"status-dispute-seller",
			"status-rejected-buyer",
			"status-rejected-seller",
			"status-sold",
			"status-expired",
			"status-success",
			"status-closed",
		]),
		payload: TransactionEntryStatusValueSchema,
	})
	.openapi("TransactionEntryStatusPayload");

export type TransactionEntryStatusPayloadSchema = typeof TransactionEntryStatusPayloadSchema;

export namespace TransactionEntryStatusPayloadSchema {
	export type Type = z.infer<TransactionEntryStatusPayloadSchema>;
}
