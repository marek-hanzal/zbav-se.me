import { z } from "zod";
import { TransactionEntryCommon } from "./CommonSchema";
import { TransactionEntryGallery } from "./GallerySchema";
import { TransactionEntryLocation } from "./LocationSchema";
import { TransactionEntryPackage } from "./PackageSchema";
import { TransactionEntryPersonal } from "./PersonalSchema";
import { TransactionEntryText } from "./TextSchema";

export const TransactionEntrySchema = z
	.discriminatedUnion("kind", [
		TransactionEntryText,
		TransactionEntryGallery,
		TransactionEntryLocation,
		TransactionEntryPackage,
		TransactionEntryPersonal,
		TransactionEntryCommon,
	])
	.meta({
		id: "TransactionEntry",
		description: "Transaction timeline entry",
	});

export type TransactionEntrySchema = typeof TransactionEntrySchema;

export namespace TransactionEntrySchema {
	export type Type = z.infer<TransactionEntrySchema>;
}
