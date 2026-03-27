import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionEntryFilterSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryFilterSchema";
import { TransactionEntrySortSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntrySortSchema";
import { TransactionEntryWhereSchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryWhereSchema";

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
