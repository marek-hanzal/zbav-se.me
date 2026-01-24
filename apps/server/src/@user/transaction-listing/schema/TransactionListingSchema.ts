import { z } from "@hono/zod-openapi";

export const TransactionListingSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing that has at least one transaction",
		}),
		count: z.coerce.number().int().nonnegative().openapi({
			description: "Total number of transactions for this listing (within the current scope)",
		}),
		lastAt: z.coerce.date().openapi({
			description:
				"Timestamp of the most recent activity in any transaction under this listing",
			type: "string",
		}),
	})
	.openapi("TransactionListing", {
		description: "Aggregated transaction information per listing",
	});

export type TransactionListingSchema = typeof TransactionListingSchema;

export namespace TransactionListingSchema {
	export type Type = z.infer<TransactionListingSchema>;
}
