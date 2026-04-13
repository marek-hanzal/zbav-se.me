import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/seller/transaction/server/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/seller/transaction/server/schema/TransactionWhereSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
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
