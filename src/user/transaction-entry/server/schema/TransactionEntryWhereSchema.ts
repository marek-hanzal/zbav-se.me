import { z } from "zod";
import { TransactionEntryFilterSchema } from "./TransactionEntryFilterSchema";

export const TransactionEntryWhereSchema = z
	.looseObject({
		...TransactionEntryFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "TransactionEntryWhere",
		description: "App-level filters for transaction entry queries",
	});

export type TransactionEntryWhereSchema = typeof TransactionEntryWhereSchema;

export namespace TransactionEntryWhereSchema {
	export type Type = z.infer<TransactionEntryWhereSchema>;
}
