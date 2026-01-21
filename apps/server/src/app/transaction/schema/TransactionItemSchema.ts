import { z } from "@hono/zod-openapi";

export const TransactionItemSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the transaction",
		}),
		lastAt: z.coerce.date().openapi({
			description: "Timestamp of the last message in the transaction",
			type: "string",
		}),
	})
	.strip()
	.openapi("TransactionItemSchema", {
		description: "Transaction collection item with last message timestamp",
	});

export type TransactionItemSchema = typeof TransactionItemSchema;

export namespace TransactionItemSchema {
	export type Type = z.infer<TransactionItemSchema>;
}
