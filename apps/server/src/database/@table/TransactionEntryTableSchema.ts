import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "~/@user/transaction-entry/schema/entry/BaseEntrySchema";
import { TransactionEntryGallerySchema } from "~/@user/transaction-entry/schema/entry/TransactionEntryGallerySchema";
import { TransactionEntryLocationSchema } from "~/@user/transaction-entry/schema/entry/TransactionEntryLocationSchema";
import { TransactionEntryPackageSchema } from "~/@user/transaction-entry/schema/entry/TransactionEntryPackageSchema";
import { TransactionEntryPersonalSchema } from "~/@user/transaction-entry/schema/entry/TransactionEntryPersonalSchema";
import { TransactionEntryTextSchema } from "~/@user/transaction-entry/schema/entry/TransactionEntryTextSchema";
import { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";

export const TransactionEntryTableSchema = z
	.discriminatedUnion("kind", [
		TransactionEntryTextSchema,
		TransactionEntryGallerySchema,
		TransactionEntryLocationSchema,
		TransactionEntryPackageSchema,
		TransactionEntryPersonalSchema,
		z.looseObject({
			...BaseEntrySchema.shape,
			kind: TransactionEntryKindEnumSchema.exclude([
				"text",
				"gallery",
				"location",
				"package",
				"personal",
			]),
			payload: z.looseObject({
				text: z.string().openapi({
					description: "Translation key for the system/status timeline entry",
				}),
			}),
		}),
	])
	.openapi("TransactionEntry", {
		description: "Transaction timeline entry",
	});

export type TransactionEntryTableSchema = typeof TransactionEntryTableSchema;

export namespace TransactionEntryTableSchema {
	export type Type = z.infer<TransactionEntryTableSchema>;
}
