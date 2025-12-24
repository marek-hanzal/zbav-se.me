import { z } from "zod";

export const TransactionMessageLocationCreateSchema = z
	.object({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a location to",
		}),
		locationId: z.string().openapi({
			description: "The ID of the location",
		}),
	})
	.openapi("TransactionMessageLocationCreate", {
		description: "Request to create a transaction message location",
	});

export type TransactionMessageLocationCreateSchema = typeof TransactionMessageLocationCreateSchema;

export namespace TransactionMessageLocationCreateSchema {
	export type Type = z.infer<TransactionMessageLocationCreateSchema>;
}
