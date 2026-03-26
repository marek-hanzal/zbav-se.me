import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { TransactionEntrySchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySchema";

export const TransactionListingSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the listing that has at least one transaction",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing that has at least one transaction",
		}),
		title: z.string().openapi({
			description: "Title of the listing",
		}),
		gallery: GallerySchema.openapi({
			description: "Listing gallery images",
		}),
		count: z.coerce.number().int().nonnegative().openapi({
			description: "Total number of transactions for this listing (within the current scope)",
		}),
		unreadCount: z.coerce.number().int().nonnegative().openapi({
			description: "Unread inbox transaction-event count for this listing",
			type: "number",
		}),
		entry: TransactionEntrySchema,
		lastAt: z.coerce.date().openapi({
			description:
				"Timestamp of the most recent activity in any transaction under this listing",
			type: "string",
		}),
	})
	.strip()
	.openapi("TransactionListing", {
		description: "Aggregated transaction information per listing",
	});

export type TransactionListingSchema = typeof TransactionListingSchema;

export namespace TransactionListingSchema {
	export type Type = z.infer<TransactionListingSchema>;
}
