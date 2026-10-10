import { z } from "zod";

export const TransactionEntryDirectionEnumSchema = z
	.enum([
		"in",
		"out",
		"system",
	])
	.meta({
		id: "TransactionEntryDirectionEnum",
		description: "Direction of the transaction entry from the current viewer perspective",
	});

export type TransactionEntryDirectionEnumSchema = typeof TransactionEntryDirectionEnumSchema;

export namespace TransactionEntryDirectionEnumSchema {
	export type Type = z.infer<TransactionEntryDirectionEnumSchema>;
}
