import { z } from "@hono/zod-openapi";
import { ListingTransactionGallerySchema } from "~/@user/listing-transaction-gallery/schema/ListingTransactionGallerySchema";
import { ListingTransactionLocationSchema } from "~/@user/listing-transaction-location/schema/ListingTransactionLocationSchema";
import { ListingTransactionMessageSchema } from "~/@user/listing-transaction-message/schema/ListingTransactionMessageSchema";
import { ListingTransactionStatusSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusSchema";
import { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";

export const ListingTransactionLogSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the transaction log entry",
		}),
		listingTransactionId: z.string().openapi({
			description: "ID of the transaction referenced by the log",
		}),
		event: ListingTransactionEventEnumSchema,
		side: ListingTransactionSideEnumSchema,
		//
		payload: z
			.union([
				ListingTransactionStatusSchema,
				ListingTransactionMessageSchema,
				ListingTransactionLocationSchema,
				ListingTransactionGallerySchema,
			])
			.openapi("ListingTransactionPayload", {
				description: "Payload of the event",
			}),
		//
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.openapi("ListingTransactionLog", {
		description: "Listing transaction log entry (unified view across all event types)",
	});

export type ListingTransactionLogSchema = typeof ListingTransactionLogSchema;

export namespace ListingTransactionLogSchema {
	export type Type = z.infer<ListingTransactionLogSchema>;
}
