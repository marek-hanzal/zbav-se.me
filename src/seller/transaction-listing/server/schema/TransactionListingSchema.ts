import { z } from "zod";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const TransactionListingSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing that has at least one transaction",
		}),
		listingId: z.string().meta({
			description: "ID of the listing that has at least one transaction",
		}),
		withImageUrl: z.array(z.string()).meta({
			description: "Ordered listing image URLs",
		}),
		count: z.coerce.number().int().nonnegative().meta({
			description: "Total number of transactions for this listing (within the current scope)",
		}),
		unread: z.coerce.number().int().nonnegative().meta({
			description: "Unread activity transaction-event count for this listing",
		}),
		entry: TransactionEntrySchema,
		lastAt: z.coerce.date().meta({
			description:
				"Timestamp of the most recent activity in any transaction under this listing",
		}),
	})
	.strip()
	.meta({
		id: "TransactionListing",
		description: "Aggregated transaction information per listing",
	});

export type TransactionListingSchema = typeof TransactionListingSchema;

export namespace TransactionListingSchema {
	export type Type = z.infer<TransactionListingSchema>;
}
