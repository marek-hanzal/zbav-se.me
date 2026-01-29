import { z } from "@hono/zod-openapi";
import { TransactionStatusFilterSchema } from "~/@session/transaction-status/schema/TransactionStatusFilterSchema";
import { TransactionStatusSortSchema } from "~/@session/transaction-status/schema/TransactionStatusSortSchema";
import { TransactionStatusWhereSchema } from "~/@session/transaction-status/schema/TransactionStatusWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const TransactionStatusQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionStatusFilterSchema.optional(),
		where: TransactionStatusWhereSchema.optional(),
		sort: TransactionStatusSortSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionStatusQuery", {
		description: "Query object for listing transaction status",
	});

export type TransactionStatusQuerySchema = typeof TransactionStatusQuerySchema;

export namespace TransactionStatusQuerySchema {
	export type Type = z.infer<TransactionStatusQuerySchema>;
}
