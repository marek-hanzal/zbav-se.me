import { z } from "@hono/zod-openapi";
import { TransactionEntryGalleryValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryGalleryValueSchema";

export const TransactionEntryGalleryPayloadSchema = z
	.looseObject({
		kind: z.literal("gallery"),
		payload: TransactionEntryGalleryValueSchema,
	})
	.openapi("TransactionEntryGalleryPayload");

export type TransactionEntryGalleryPayloadSchema = typeof TransactionEntryGalleryPayloadSchema;

export namespace TransactionEntryGalleryPayloadSchema {
	export type Type = z.infer<TransactionEntryGalleryPayloadSchema>;
}
