import { z } from "@hono/zod-openapi";
import { TransactionEntryGalleryCreateSchema } from "~/@user/transaction-entry/schema/create/TransactionEntryGalleryCreateSchema";
import { TransactionEntryLocationCreateSchema } from "~/@user/transaction-entry/schema/create/TransactionEntryLocationCreateSchema";
import { TransactionEntryPackageCreateSchema } from "~/@user/transaction-entry/schema/create/TransactionEntryPackageCreateSchema";
import { TransactionEntryPersonalCreateSchema } from "~/@user/transaction-entry/schema/create/TransactionEntryPersonalCreateSchema";
import { TransactionEntryTextCreateSchema } from "~/@user/transaction-entry/schema/create/TransactionEntryTextCreateSchema";

export const TransactionEntryCreateSchema = z
	.discriminatedUnion("kind", [
		TransactionEntryTextCreateSchema,
		TransactionEntryGalleryCreateSchema,
		TransactionEntryLocationCreateSchema,
		TransactionEntryPackageCreateSchema,
		TransactionEntryPersonalCreateSchema,
	])
	.openapi("TransactionEntryCreate", {
		description: "Request to append a user-authored transaction entry",
	});

export type TransactionEntryCreateSchema = typeof TransactionEntryCreateSchema;

export namespace TransactionEntryCreateSchema {
	export type Type = z.infer<TransactionEntryCreateSchema>;
}
