import { z } from "@hono/zod-openapi";

export const TransactionSideEnumSchema = z
	.enum([
		"seller",
		"buyer",
		"transaction",
		"system",
		"unknown",
	])
	.openapi("TransactionSideEnum", {
		description: "Who initiated or affected the transaction change",
	});

export type TransactionSideEnumSchema = typeof TransactionSideEnumSchema;

export namespace TransactionSideEnumSchema {
	export type Type = z.infer<TransactionSideEnumSchema>;
}
