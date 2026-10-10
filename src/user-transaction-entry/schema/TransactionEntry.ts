import { z } from "zod";
import { TransactionEntryCommon } from "~/user-transaction-entry/schema/TransactionEntryCommonSchema";
import { TransactionEntryGallery } from "~/user-transaction-entry/schema/TransactionEntryGallerySchema";
import { TransactionEntryLocation } from "~/user-transaction-entry/schema/TransactionEntryLocationSchema";
import { TransactionEntryPackage } from "~/user-transaction-entry/schema/TransactionEntryPackageSchema";
import { TransactionEntryPersonal } from "~/user-transaction-entry/schema/TransactionEntryPersonalSchema";
import { TransactionEntryText } from "~/user-transaction-entry/schema/TransactionEntryTextSchema";

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
