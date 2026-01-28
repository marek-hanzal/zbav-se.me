import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionListingFilterSchema } from "~/@seller-user/transaction-listing/schema/TransactionListingFilterSchema";
import { TransactionListingSortSchema } from "~/@seller-user/transaction-listing/schema/TransactionListingSortSchema";

export const TransactionListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionListingFilterSchema.optional(),
		where: TransactionListingFilterSchema.openapi("TransactionListingWhere", {
			description: "App-based filters for transaction-listing",
		}).optional(),
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
