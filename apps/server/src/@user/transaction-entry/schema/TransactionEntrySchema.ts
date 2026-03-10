import { z } from "@hono/zod-openapi";
import { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import { CommonSchema } from "~/database/@table/TransactionEntryTableSchema/CommonSchema";
import { GallerySchema } from "~/database/@table/TransactionEntryTableSchema/GallerySchema";
import { LocationSchema } from "~/database/@table/TransactionEntryTableSchema/LocationSchema";
import { PackageSchema } from "~/database/@table/TransactionEntryTableSchema/PackageSchema";
import { PersonalSchema } from "~/database/@table/TransactionEntryTableSchema/PersonalSchema";
import { TextSchema } from "~/database/@table/TransactionEntryTableSchema/TextSchema";

export const TransactionEntrySchema = z
	.discriminatedUnion("kind", [
		z
			.looseObject({
				...TextSchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryText", {
				description: "Transaction text entry with user-authored message payload",
			}),
		z
			.looseObject({
				...GallerySchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryGallery", {
				description: "Transaction gallery entry with linked gallery payload",
			}),
		z
			.looseObject({
				...LocationSchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryLocation", {
				description: "Transaction location entry with linked location payload",
			}),
		z
			.looseObject({
				...PackageSchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryPackage", {
				description: "Transaction package entry with shipment tracking payload",
			}),
		z
			.looseObject({
				...PersonalSchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryPersonal", {
				description: "Transaction personal entry with contact and handoff payload",
			}),
		z
			.looseObject({
				...CommonSchema.shape,
				direction: TransactionEntryDirectionEnumSchema,
			})
			.openapi("TransactionEntryCommon", {
				description: "Transaction system entry with shared status or informational payload",
			}),
	])
	.openapi("TransactionEntry", {
		description: "Transaction timeline entry",
	});

export type TransactionEntrySchema = typeof TransactionEntrySchema;

export namespace TransactionEntrySchema {
	export type Type = z.infer<TransactionEntrySchema>;
}
