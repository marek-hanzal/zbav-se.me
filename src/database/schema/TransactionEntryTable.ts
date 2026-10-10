import { z } from "zod";
import { CommonSchema } from "~/database/schema/TransactionEntryTableCommonSchema";
import { GallerySchema } from "~/database/schema/TransactionEntryTableGallerySchema";
import { LocationSchema } from "~/database/schema/TransactionEntryTableLocationSchema";
import { PackageSchema } from "~/database/schema/TransactionEntryTablePackageSchema";
import { PersonalSchema } from "~/database/schema/TransactionEntryTablePersonalSchema";
import { TextSchema } from "~/database/schema/TransactionEntryTableTextSchema";

export const TransactionEntryTableSchema = z
	.discriminatedUnion("kind", [
		TextSchema,
		GallerySchema,
		LocationSchema,
		PackageSchema,
		PersonalSchema,
		CommonSchema,
	])
	.meta({
		id: "TransactionEntryTable",
		description: "Database row variants for transaction entry content.",
	});

export type TransactionEntryTableSchema = typeof TransactionEntryTableSchema;

export namespace TransactionEntryTableSchema {
	export type Type = z.infer<TransactionEntryTableSchema>;
}
