import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionLogFilterSchema } from "./TransactionLogFilterSchema";
import { TransactionLogSortSchema } from "./TransactionLogSortSchema";

export const TransactionLogQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: TransactionLogFilterSchema.optional(),
		where: TransactionLogFilterSchema.openapi("TransactionLogWhere", {
			description: "App-based filters",
		}).optional(),
		sort: TransactionLogSortSchema.array().optional(),
	})
	.openapi("TransactionLogQuery", {
		description: "Query object for listing transaction log collection",
	});

export type TransactionLogQuerySchema = typeof TransactionLogQuerySchema;

export namespace TransactionLogQuerySchema {
	export type Type = z.infer<TransactionLogQuerySchema>;
}
