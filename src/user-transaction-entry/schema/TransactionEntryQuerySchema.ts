import { z } from "zod";
import { CursorSchema } from "~/query/schema/CursorSchema";
import { TransactionEntrySortSchema } from "~/user-transaction-entry/schema/TransactionEntrySortSchema";
import { TransactionEntryWhereSchema } from "~/user-transaction-entry/schema/TransactionEntryWhereSchema";

export const TransactionEntryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
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
