import { z } from "zod";

export const TransactionItemSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the transaction",
		}),
		lastAt: z.coerce.date().meta({
			description: "Timestamp of the last message in the transaction",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "TransactionItem",
		description: "Transaction collection item with last message timestamp",
	});

export type TransactionItemSchema = typeof TransactionItemSchema;

export namespace TransactionItemSchema {
	export type Type = z.infer<TransactionItemSchema>;
}
