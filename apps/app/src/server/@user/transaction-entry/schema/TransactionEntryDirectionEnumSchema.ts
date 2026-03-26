import { z } from "@hono/zod-openapi";

export const TransactionEntryDirectionEnumSchema = z
	.enum([
		"in",
		"out",
		"system",
	])
	.openapi("TransactionEntryDirectionEnum", {
		description: "Direction of the transaction entry from the current viewer perspective",
	});

export type TransactionEntryDirectionEnumSchema = typeof TransactionEntryDirectionEnumSchema;

export namespace TransactionEntryDirectionEnumSchema {
	export type Type = z.infer<TransactionEntryDirectionEnumSchema>;
}
