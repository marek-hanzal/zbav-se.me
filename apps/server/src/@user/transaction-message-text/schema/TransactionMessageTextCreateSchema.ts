import { z } from "@hono/zod-openapi";

export const TransactionMessageTextCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.openapi("TransactionMessageTextCreate", {
		description: "Request to create a transaction message",
	});

export type TransactionMessageTextCreateSchema = typeof TransactionMessageTextCreateSchema;

export namespace TransactionMessageTextCreateSchema {
	export type Type = z.infer<TransactionMessageTextCreateSchema>;
}
