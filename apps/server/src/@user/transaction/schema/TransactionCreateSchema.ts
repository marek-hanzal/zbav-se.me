import { z } from "@hono/zod-openapi";

export const TransactionCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing to start a transaction for",
		}),
	})
	.openapi("TransactionCreate", {
		description: "Data for creating a new transaction",
	});

export type TransactionCreateSchema = typeof TransactionCreateSchema;

export namespace TransactionCreateSchema {
	export type Type = z.infer<TransactionCreateSchema>;
}
