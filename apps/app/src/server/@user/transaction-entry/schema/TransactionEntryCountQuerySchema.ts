import { z } from "zod";
import { TransactionEntryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryQuerySchema";

export const TransactionEntryCountQuerySchema = z
	.looseObject({
		...TransactionEntryQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "TransactionEntryCountQuery",
		description: "Query object for transaction entry count",
	});

export type TransactionEntryCountQuerySchema = typeof TransactionEntryCountQuerySchema;

export namespace TransactionEntryCountQuerySchema {
	export type Type = z.infer<TransactionEntryCountQuerySchema>;
}
