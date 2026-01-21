import { z } from "@hono/zod-openapi";

export const TransactionListingItemSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		count: z.number().openapi({
			description: "Number of transactions for this listing",
		}),
		lastAt: z.coerce.date().openapi({
			description: "Timestamp of the last transaction update",
			type: "string",
		}),
	})
	.openapi("TransactionListingItemSchema", {
		description: "Transaction listing collection item",
	});

export type TransactionListingItemSchema = typeof TransactionListingItemSchema;

export namespace TransactionListingItemSchema {
	export type Type = z.infer<TransactionListingItemSchema>;
}
