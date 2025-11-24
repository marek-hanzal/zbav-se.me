import { z } from "@hono/zod-openapi";
import { ListingTransactionGallerySchema } from "~/@user/listing-transaction-gallery/schema/ListingTransactionGallerySchema";
import { ListingTransactionLocationSchema } from "~/@user/listing-transaction-location/schema/ListingTransactionLocationSchema";
import { ListingTransactionMessageSchema } from "~/@user/listing-transaction-message/schema/ListingTransactionMessageSchema";
import { ListingTransactionStatusSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusSchema";

export const ListingTransactionLogSchema = z
	.union([
		ListingTransactionStatusSchema,
		ListingTransactionMessageSchema,
		ListingTransactionLocationSchema,
		ListingTransactionGallerySchema,
	])
	.openapi("ListingTransactionLog", {
		description: "Listing transaction log entry (unified view across all event types)",
	});

export type ListingTransactionLogSchema = typeof ListingTransactionLogSchema;

export namespace ListingTransactionLogSchema {
	export type Type = z.infer<ListingTransactionLogSchema>;
}
