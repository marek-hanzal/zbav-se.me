import { z } from "zod";
import { TransactionEntryQuerySchema } from "./TransactionEntryQuerySchema";
import { TransactionEntryToolFilterSchema } from "./TransactionEntryToolFilterSchema";

export const TransactionEntryToolQuerySchema = z
	.looseObject({
		...TransactionEntryQuerySchema.shape,
		filter: TransactionEntryToolFilterSchema.optional(),
		where: TransactionEntryToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "TransactionEntryToolQuery",
		description: "Query object for transaction entry tools",
	});

export type TransactionEntryToolQuerySchema = typeof TransactionEntryToolQuerySchema;

export namespace TransactionEntryToolQuerySchema {
	export type Type = z.infer<TransactionEntryToolQuerySchema>;
}
