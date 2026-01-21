import { z } from "@hono/zod-openapi";

export const TransactionCollectionItemSchema = z
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
	.openapi("TransactionCollectionItem", {
		description: "Transaction collection item with last message timestamp",
	});

export type TransactionCollectionItemSchema = typeof TransactionCollectionItemSchema;

export namespace TransactionCollectionItemSchema {
	export type Type = z.infer<TransactionCollectionItemSchema>;
}
