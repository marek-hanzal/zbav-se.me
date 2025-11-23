import { z } from "@hono/zod-openapi";

export const ListingTransactionSideEnumSchema = z
	.enum([
		"seller",
		"buyer",
		"transaction",
		"system",
		"unknown",
	])
	.openapi("ListingTransactionSideEnum", {
		description: "Who initiated or affected the transaction change",
	});

export type ListingTransactionSideEnumSchema = typeof ListingTransactionSideEnumSchema;

export namespace ListingTransactionSideEnumSchema {
	export type Type = z.infer<ListingTransactionSideEnumSchema>;
}
