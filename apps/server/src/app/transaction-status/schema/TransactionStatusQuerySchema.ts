import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionStatusFilterSchema } from "./TransactionStatusFilterSchema";
import { TransactionStatusSortSchema } from "./TransactionStatusSortSchema";

export const TransactionStatusQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: TransactionStatusFilterSchema.optional(),
		where: TransactionStatusFilterSchema.openapi("TransactionStatusWhere", {
			description: "App-based filters",
		}).optional(),
		sort: TransactionStatusSortSchema.array().optional(),
	})
	.openapi("TransactionStatusQuery", {
		description: "Query object for listing transaction status",
	});

export type TransactionStatusQuerySchema = typeof TransactionStatusQuerySchema;

export namespace TransactionStatusQuerySchema {
	export type Type = z.infer<TransactionStatusQuerySchema>;
}
