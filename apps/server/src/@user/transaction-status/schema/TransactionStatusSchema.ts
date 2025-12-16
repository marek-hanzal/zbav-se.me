import { z } from "@hono/zod-openapi";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/ListingTransactionEventEnumSchema";
import { TransactionStatusDbSchema } from "~/app/transaction-status/schema/ListingTransactionStatusDbSchema";

export const TransactionStatusSchema = z
	.object({
		...TransactionStatusDbSchema.shape,
		event: z.literal("status" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("TransactionStatus", {
		description: "Listing transaction status entry",
	});

export type TransactionStatusSchema = typeof TransactionStatusSchema;

export namespace TransactionStatusSchema {
	export type Type = z.infer<TransactionStatusSchema>;
}
