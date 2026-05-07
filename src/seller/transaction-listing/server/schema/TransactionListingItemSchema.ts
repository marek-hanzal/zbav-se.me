import { z } from "zod";

export const TransactionListingItemSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		count: z.coerce.number().int().nonnegative().meta({
			description: "Total number of transactions for this listing",
		}),
		lastAt: z.coerce.date().meta({
			description: "Timestamp of the most recent activity",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "TransactionListingItem",
		description: "Transaction-listing collection item",
	});

export type TransactionListingItemSchema = typeof TransactionListingItemSchema;

export namespace TransactionListingItemSchema {
	export type Type = z.infer<TransactionListingItemSchema>;
}
