import { z } from "@hono/zod-openapi";

export const ListingTransactionEventEnumSchema = z
	.enum([
		"status",
		"message",
		"gallery",
		"location",
	])
	.openapi("ListingTransactionEventEnum", {
		description: "Type of transaction event",
	});

export type ListingTransactionEventEnumSchema = typeof ListingTransactionEventEnumSchema;

export namespace ListingTransactionEventEnumSchema {
	export type Type = z.infer<ListingTransactionEventEnumSchema>;
}
