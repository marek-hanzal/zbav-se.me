import { z } from "@hono/zod-openapi";
import { TransactionEntryGalleryPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryGalleryPayloadSchema";
import { TransactionEntryLocationPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryLocationPayloadSchema";
import { TransactionEntryPackagePayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryPackagePayloadSchema";
import { TransactionEntryPersonalPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryPersonalPayloadSchema";
import { TransactionEntryStatusPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryStatusPayloadSchema";
import { TransactionEntryTextPayloadSchema } from "~/@user/transaction-entry/schema/payload/TransactionEntryTextPayloadSchema";

export const TransactionEntryPayloadSchema = z
	.discriminatedUnion("kind", [
		TransactionEntryTextPayloadSchema,
		TransactionEntryGalleryPayloadSchema,
		TransactionEntryLocationPayloadSchema,
		TransactionEntryPackagePayloadSchema,
		TransactionEntryPersonalPayloadSchema,
		TransactionEntryStatusPayloadSchema,
	])
	.openapi("TransactionEntryPayload");

export type TransactionEntryPayloadSchema = typeof TransactionEntryPayloadSchema;

export namespace TransactionEntryPayloadSchema {
	export type Type = z.infer<TransactionEntryPayloadSchema>;
}
