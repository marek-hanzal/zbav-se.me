import { z } from "@hono/zod-openapi";

export const TransactionMessagePersonalCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "The ID of the transaction to add a personal message to",
		}),
		name: z.string().openapi({
			description: "Name",
		}),
		phone: z.string().openapi({
			description: "Phone number",
		}),
		email: z.email().openapi({
			description: "Email address",
		}),
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
	})
	.strip()
	.openapi("TransactionMessagePersonalCreate", {
		description: "Request to create a transaction personal message",
	});

export type TransactionMessagePersonalCreateSchema = typeof TransactionMessagePersonalCreateSchema;

export namespace TransactionMessagePersonalCreateSchema {
	export type Type = z.infer<TransactionMessagePersonalCreateSchema>;
}
