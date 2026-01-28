import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionFilterSchema } from "~/@buyer-user/transaction/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/@buyer-user/transaction/schema/TransactionSortSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
		where: TransactionFilterSchema.openapi("TransactionWhere", {
			description: "App-based filters",
		}).optional(),
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
