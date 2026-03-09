import type { z } from "@hono/zod-openapi";
import { TransactionEntryTableSchema } from "~/database/@table/TransactionEntryTableSchema";

export const TransactionEntrySchema = TransactionEntryTableSchema;

export type TransactionEntrySchema = typeof TransactionEntrySchema;

export namespace TransactionEntrySchema {
	export type Type = z.infer<TransactionEntrySchema>;
}
