import { z } from "@hono/zod-openapi";
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
	 * We intentionally does not have .openapi() here as this create schema is
	 * hidden from openapi (create endpoint should have it's custom version of this schema)
	 */
]);

export type TransactionEntryCreateSchema = typeof TransactionEntryCreateSchema;

export namespace TransactionEntryCreateSchema {
	export type Type = z.infer<TransactionEntryCreateSchema>;
}
