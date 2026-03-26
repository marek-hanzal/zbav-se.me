import type { z } from "@hono/zod-openapi";
import { TransactionEntryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryQuerySchema";

export const TransactionEntryCountQuerySchema = TransactionEntryQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("TransactionEntryCountQuery", {
	description: "Query object for transaction entry count",
});

export type TransactionEntryCountQuerySchema = typeof TransactionEntryCountQuerySchema;

export namespace TransactionEntryCountQuerySchema {
	export type Type = z.infer<TransactionEntryCountQuerySchema>;
}
