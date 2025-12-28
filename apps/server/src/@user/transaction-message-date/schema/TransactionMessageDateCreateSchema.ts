import { z } from "@hono/zod-openapi";

export const TransactionMessageDateCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a date message to",
		}),
		datetime: z.coerce.date().openapi({
			description: "Date and time",
			type: "string",
		}),
	})
	.openapi("TransactionMessageDateCreate", {
		description: "Request to create a transaction message date",
	});

export type TransactionMessageDateCreateSchema = typeof TransactionMessageDateCreateSchema;

export namespace TransactionMessageDateCreateSchema {
	export type Type = z.infer<TransactionMessageDateCreateSchema>;
}
