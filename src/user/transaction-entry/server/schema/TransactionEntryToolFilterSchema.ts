import { z } from "zod";
import { TransactionEntryFilterSchema } from "./TransactionEntryFilterSchema";

export const TransactionEntryToolFilterSchema = z
	.looseObject({
		...TransactionEntryFilterSchema.shape,
	})
	.omit({
		idIn: true,
		userId: true,
		kindIn: true,
	})
	.strip();

export type TransactionEntryToolFilterSchema = typeof TransactionEntryToolFilterSchema;

export namespace TransactionEntryToolFilterSchema {
	export type Type = z.infer<TransactionEntryToolFilterSchema>;
}
