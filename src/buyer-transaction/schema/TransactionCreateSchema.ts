import { z } from "zod";

export const TransactionCreateSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing to start a transaction for",
		}),
	})
	.strip()
	.meta({
		id: "TransactionCreate",
		description: "Data for creating a new transaction",
	});

export type TransactionCreateSchema = typeof TransactionCreateSchema;

export namespace TransactionCreateSchema {
	export type Type = z.infer<TransactionCreateSchema>;
}
