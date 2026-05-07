import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { TransactionEntryFilterSchema } from "~/user/transaction-entry/server/schema/TransactionEntryFilterSchema";
import { TransactionEntrySortSchema } from "~/user/transaction-entry/server/schema/TransactionEntrySortSchema";
import { TransactionEntryWhereSchema } from "~/user/transaction-entry/server/schema/TransactionEntryWhereSchema";

export const TransactionEntryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionEntryFilterSchema.optional(),
		where: TransactionEntryWhereSchema.optional(),
		sort: TransactionEntrySortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
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
