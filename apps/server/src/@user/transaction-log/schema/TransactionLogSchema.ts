import { z } from "@hono/zod-openapi";
import { TransactionGallerySchema } from "~/@user/transaction-gallery/schema/TransactionGallerySchema";
import { TransactionLocationSchema } from "~/@user/transaction-location/schema/TransactionLocationSchema";
import { MessageSchema } from "~/@user/message/schema/MessageSchema";
import { TransactionStatusSchema } from "~/@user/transaction-status/schema/TransactionStatusSchema";

export const TransactionLogSchema = z
	.union([
		TransactionStatusSchema,
		MessageSchema,
		TransactionLocationSchema,
		TransactionGallerySchema,
	])
	.openapi("TransactionLog", {
		description: "Listing transaction log entry (unified view across all event types)",
	});

export type TransactionLogSchema = typeof TransactionLogSchema;

export namespace TransactionLogSchema {
	export type Type = z.infer<TransactionLogSchema>;
}
