import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";

export const TransactionStatusTableSchema = z.object({
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

export type TransactionStatusTableSchema = typeof TransactionStatusTableSchema;

export namespace TransactionStatusTableSchema {
	export type Type = z.infer<TransactionStatusTableSchema>;
}
