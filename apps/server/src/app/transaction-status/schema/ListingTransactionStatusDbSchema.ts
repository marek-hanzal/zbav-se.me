import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/ListingTransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/ListingTransactionStatusEnumSchema";

export const TransactionStatusDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction status entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the transaction referenced by the status",
	}),
	side: TransactionSideEnumSchema,
	status: TransactionStatusEnumSchema,
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type TransactionStatusDbSchema = typeof TransactionStatusDbSchema;

export namespace TransactionStatusDbSchema {
	export type Type = z.infer<TransactionStatusDbSchema>;
}
