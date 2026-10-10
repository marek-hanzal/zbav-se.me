import { z } from "zod";
import { CommonSchema } from "~/user-transaction-entry/schema/TransactionEntryCreateCommonSchema";
import { GallerySchema } from "~/user-transaction-entry/schema/TransactionEntryCreateGallerySchema";
import { LocationSchema } from "~/user-transaction-entry/schema/TransactionEntryCreateLocationSchema";
import { PackageSchema } from "~/user-transaction-entry/schema/TransactionEntryCreatePackageSchema";
import { PersonalSchema } from "~/user-transaction-entry/schema/TransactionEntryCreatePersonalSchema";
import { TextSchema } from "~/user-transaction-entry/schema/TransactionEntryCreateTextSchema";

export const TransactionEntryCreateSchema = z.discriminatedUnion("kind", [
	TextSchema,
	GallerySchema,
	LocationSchema,
	PackageSchema,
	PersonalSchema,
	CommonSchema,
	/**
	 * We intentionally do not add .meta({ id:  }) here because this create schema is
	 * hidden from the public contract and the endpoint has its own tailored schema.
	 */
]);

export type TransactionEntryCreateSchema = typeof TransactionEntryCreateSchema;

export namespace TransactionEntryCreateSchema {
	export type Type = z.infer<TransactionEntryCreateSchema>;
}
