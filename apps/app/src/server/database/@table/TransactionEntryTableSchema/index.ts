import { z } from "zod";
import { CommonSchema } from "./CommonSchema";
import { GallerySchema } from "./GallerySchema";
import { LocationSchema } from "./LocationSchema";
import { PackageSchema } from "./PackageSchema";
import { PersonalSchema } from "./PersonalSchema";
import { TextSchema } from "./TextSchema";

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
