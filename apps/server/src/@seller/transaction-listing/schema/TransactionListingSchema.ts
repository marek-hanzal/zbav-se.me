import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";

const LastKindSchema = z.enum([
	"text",
	"gallery",
	"location",
	"package",
	"personal",
	"status-pending",
	"status-open",
	"status-resolved",
	"status-dispute-buyer",
	"status-dispute-seller",
	"status-rejected-buyer",
	"status-rejected-seller",
	"status-sold",
	"status-expired",
	"status-success",
	"status-closed",
]);

export const TransactionListingSchema = z
	.object({
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
		}),
		lastAt: z.coerce.date().openapi({
			description:
				"Timestamp of the most recent activity in any transaction under this listing",
			type: "string",
		}),
		lastKind: LastKindSchema.openapi({
			description: "Kind of the most recent transaction activity under this listing",
		}),
		lastText: z.string().nullable().openapi({
			description:
				"Text payload of the most recent transaction activity when the kind is text",
		}),
	})
	.openapi("TransactionListing", {
		description: "Aggregated transaction information per listing",
	});

export type TransactionListingSchema = typeof TransactionListingSchema;

export namespace TransactionListingSchema {
	export type Type = z.infer<TransactionListingSchema>;
}
