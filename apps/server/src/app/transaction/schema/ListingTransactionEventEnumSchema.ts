import { z } from "@hono/zod-openapi";

export const TransactionEventEnumSchema = z
	.enum([
		"status",
		"message",
		"gallery",
		"location",
	])
	.openapi("TransactionEventEnum", {
		description: "Type of transaction event",
	});

export type TransactionEventEnumSchema = typeof TransactionEventEnumSchema;

export namespace TransactionEventEnumSchema {
	export type Type = z.infer<TransactionEventEnumSchema>;
}
