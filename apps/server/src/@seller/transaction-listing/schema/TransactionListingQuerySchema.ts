import { z } from "@hono/zod-openapi";
import { TransactionListingFilterSchema } from "~/@seller/transaction-listing/schema/TransactionListingFilterSchema";
import { TransactionListingSortSchema } from "~/@seller/transaction-listing/schema/TransactionListingSortSchema";
import { TransactionListingWhereSchema } from "~/@seller/transaction-listing/schema/TransactionListingWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const TransactionListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionListingFilterSchema.optional(),
		where: TransactionListingWhereSchema.optional(),
		sort: TransactionListingSortSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionListingQuery", {
		description: "Query object for transaction-listing collection",
	});

export type TransactionListingQuerySchema = typeof TransactionListingQuerySchema;

export namespace TransactionListingQuerySchema {
	export type Type = z.infer<TransactionListingQuerySchema>;
}
