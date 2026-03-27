import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionEntryFilterSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryFilterSchema";
import { TransactionEntrySortSchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySortSchema";
import { TransactionEntryWhereSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryWhereSchema";

export const TransactionEntryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionEntryFilterSchema.optional(),
		where: TransactionEntryWhereSchema.optional(),
		sort: TransactionEntrySortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "TransactionEntryQuery",
		description: "Query object for transaction entry collection",
	});

export type TransactionEntryQuerySchema = typeof TransactionEntryQuerySchema;

export namespace TransactionEntryQuerySchema {
	export type Type = z.infer<TransactionEntryQuerySchema>;
}
