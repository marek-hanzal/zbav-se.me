import { z } from "@hono/zod-openapi";

export const ListingTransactionSideSchema = z
	.enum([
		"seller",
		"buyer",
		"transaction",
		"system",
		"unknown",
	])
	.openapi("ListingTransactionSide", {
		description: "Who initiated or affected the transaction change",
	});

export type ListingTransactionSideSchema = typeof ListingTransactionSideSchema;

export namespace ListingTransactionSideSchema {
	export type Type = z.infer<ListingTransactionSideSchema>;
}
