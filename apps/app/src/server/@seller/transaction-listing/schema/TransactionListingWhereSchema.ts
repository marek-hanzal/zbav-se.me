import { z } from "@hono/zod-openapi";
import { TransactionListingFilterSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingFilterSchema";

export const TransactionListingWhereSchema = z
	.looseObject({
		...TransactionListingFilterSchema.shape,
	})
	.strip()
	.openapi("TransactionListingWhere", {
		description: "App-based filters",
	});

export type TransactionListingWhereSchema = typeof TransactionListingWhereSchema;

export namespace TransactionListingWhereSchema {
	export type Type = z.infer<TransactionListingWhereSchema>;
}
