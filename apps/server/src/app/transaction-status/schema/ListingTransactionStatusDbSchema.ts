import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/app/transaction/schema/TransactionStatusEnumSchema";

export const TransactionStatusDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the transaction status entry",
	}),
	transactionId: z.string().openapi({
		description: "ID of the transaction referenced by the status",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing referenced by the status",
	}),
	userId: z.string().openapi({
		description: "ID of the user who performed the action",
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
