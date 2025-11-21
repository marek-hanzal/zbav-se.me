import { z } from "@hono/zod-openapi";

export const ListingTransactionEventSchema = z
	.enum([
		"status",
		"message",
		"gallery",
		"location",
	])
	.openapi("ListingTransactionEvent", {
		description: "Type of transaction event",
	});

export type ListingTransactionEventSchema = typeof ListingTransactionEventSchema;

export namespace ListingTransactionEventSchema {
	export type Type = z.infer<ListingTransactionEventSchema>;
}
