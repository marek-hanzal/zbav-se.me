import { z } from "zod";

export const TransactionSideEnumSchema = z
	.enum([
		"seller",
		"buyer",
		"transaction",
		"system",
		"unknown",
	])
	.meta({
		id: "TransactionSideEnum",
		description: "Who initiated or affected the transaction change",
	});

export type TransactionSideEnumSchema = typeof TransactionSideEnumSchema;

export namespace TransactionSideEnumSchema {
	export type Type = z.infer<TransactionSideEnumSchema>;
}
