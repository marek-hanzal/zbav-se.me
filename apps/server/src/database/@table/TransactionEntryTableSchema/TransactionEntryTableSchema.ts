import { z } from "@hono/zod-openapi";
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
	.openapi("TransactionEntry", {
		description: "Transaction timeline entry",
	});

export type TransactionEntryTableSchema = typeof TransactionEntryTableSchema;

export namespace TransactionEntryTableSchema {
	export type Type = z.infer<TransactionEntryTableSchema>;
}
