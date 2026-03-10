import { z } from "@hono/zod-openapi";
import { CommonSchema } from "./CommonSchema";
import { GallerySchema } from "./GallerySchema";
import { LocationSchema } from "./LocationSchema";
import { PackageSchema } from "./PackageSchema";
import { PersonalSchema } from "./PersonalSchema";
import { TextSchema } from "./TextSchema";

export const TransactionEntryCreateSchema = z
	.discriminatedUnion("kind", [
		TextSchema,
		GallerySchema,
		LocationSchema,
		PackageSchema,
		PersonalSchema,
		CommonSchema,
	])
	.openapi("TransactionEntryCreate", {
		description: "Request to append a user-authored transaction entry",
	});

export type TransactionEntryCreateSchema = typeof TransactionEntryCreateSchema;

export namespace TransactionEntryCreateSchema {
	export type Type = z.infer<TransactionEntryCreateSchema>;
}
