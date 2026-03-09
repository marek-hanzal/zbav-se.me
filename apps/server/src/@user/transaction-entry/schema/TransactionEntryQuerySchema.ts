import { z } from "@hono/zod-openapi";
import { TransactionEntryFilterSchema } from "~/@user/transaction-entry/schema/TransactionEntryFilterSchema";
import { TransactionEntrySortSchema } from "~/@user/transaction-entry/schema/TransactionEntrySortSchema";
import { TransactionEntryWhereSchema } from "~/@user/transaction-entry/schema/TransactionEntryWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const TransactionEntryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionEntryFilterSchema.optional(),
		where: TransactionEntryWhereSchema.optional(),
		sort: TransactionEntrySortSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionEntryQuery", {
		description: "Query object for transaction entry collection",
	});

export type TransactionEntryQuerySchema = typeof TransactionEntryQuerySchema;

export namespace TransactionEntryQuerySchema {
	export type Type = z.infer<TransactionEntryQuerySchema>;
}
