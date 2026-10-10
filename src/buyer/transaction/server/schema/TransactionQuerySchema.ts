import { z } from "zod";
import { TransactionSortSchema } from "~/buyer/transaction/server/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/buyer/transaction/server/schema/TransactionWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: TransactionWhereSchema.optional(),
		sort: TransactionSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "TransactionQuery",
		description: "Query object for transaction collection",
	});

export type TransactionQuerySchema = typeof TransactionQuerySchema;

export namespace TransactionQuerySchema {
	export type Type = z.infer<TransactionQuerySchema>;
}
