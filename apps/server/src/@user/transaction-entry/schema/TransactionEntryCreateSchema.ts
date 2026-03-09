import { z } from "@hono/zod-openapi";
import { GalleryCreateSchema } from "~/@user/transaction-entry/schema/create/GalleryCreateSchema";
import { LocationCreateSchema } from "~/@user/transaction-entry/schema/create/LocationCreateSchema";
import { PackageCreateSchema } from "~/@user/transaction-entry/schema/create/PackageCreateSchema";
import { PersonalCreateSchema } from "~/@user/transaction-entry/schema/create/PersonalCreateSchema";
import { TextCreateSchema } from "~/@user/transaction-entry/schema/create/TextCreateSchema";

export const TransactionEntryCreateSchema = z
	.discriminatedUnion("kind", [
		TextCreateSchema,
		GalleryCreateSchema,
		LocationCreateSchema,
		PackageCreateSchema,
		PersonalCreateSchema,
	])
	.openapi("TransactionEntryCreate", {
		description: "Request to append a user-authored transaction entry",
	});

export type TransactionEntryCreateSchema = typeof TransactionEntryCreateSchema;

export namespace TransactionEntryCreateSchema {
	export type Type = z.infer<TransactionEntryCreateSchema>;
}
