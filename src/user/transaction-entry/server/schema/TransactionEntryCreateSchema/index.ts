import { z } from "zod";
import { CommonSchema } from "./CommonSchema";
import { GallerySchema } from "./GallerySchema";
import { LocationSchema } from "./LocationSchema";
import { PackageSchema } from "./PackageSchema";
import { PersonalSchema } from "./PersonalSchema";
import { TextSchema } from "./TextSchema";

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
