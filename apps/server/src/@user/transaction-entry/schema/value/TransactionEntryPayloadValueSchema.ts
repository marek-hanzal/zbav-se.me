import { z } from "@hono/zod-openapi";
import { TransactionEntryGalleryValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryGalleryValueSchema";
import { TransactionEntryLocationValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryLocationValueSchema";
import { TransactionEntryPackageValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPackageValueSchema";
import { TransactionEntryPersonalValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryPersonalValueSchema";
import { TransactionEntryStatusValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryStatusValueSchema";
import { TransactionEntryTextValueSchema } from "~/@user/transaction-entry/schema/value/TransactionEntryTextValueSchema";

export const TransactionEntryPayloadValueSchema = z
	.union([
		TransactionEntryTextValueSchema,
		TransactionEntryGalleryValueSchema,
		TransactionEntryLocationValueSchema,
		TransactionEntryPackageValueSchema,
		TransactionEntryPersonalValueSchema,
		TransactionEntryStatusValueSchema,
	])
	.openapi("TransactionEntryPayloadValue");

export type TransactionEntryPayloadValueSchema = typeof TransactionEntryPayloadValueSchema;

export namespace TransactionEntryPayloadValueSchema {
	export type Type = z.infer<TransactionEntryPayloadValueSchema>;
}
