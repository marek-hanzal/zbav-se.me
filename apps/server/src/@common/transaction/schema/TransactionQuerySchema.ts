import { z } from "@hono/zod-openapi";
import { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/@common/transaction/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/@common/transaction/schema/TransactionWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
		where: TransactionWhereSchema.optional(),
		sort: TransactionSortSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionQuery", {
		description: "Query object for transaction collection",
	});

export type TransactionQuerySchema = typeof TransactionQuerySchema;

export namespace TransactionQuerySchema {
	export type Type = z.infer<TransactionQuerySchema>;
}
