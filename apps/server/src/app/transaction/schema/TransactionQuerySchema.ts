import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionFilterSchema } from "./TransactionFilterSchema";
import { TransactionMetaSchema } from "~/@user/transaction/schema/TransactionMetaSchema";
import { TransactionSortSchema } from "./TransactionSortSchema";

export const TransactionQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
		where: TransactionFilterSchema.openapi("TransactionWhere", {
			description: "App-based filters",
		}).optional(),
		sort: TransactionSortSchema.array().optional(),
		meta: TransactionMetaSchema.optional(),
	})
	.openapi("TransactionQuery", {
		description: "Query object for transaction collection",
	});

export type TransactionQuerySchema = typeof TransactionQuerySchema;

export namespace TransactionQuerySchema {
	export type Type = z.infer<TransactionQuerySchema>;
}
