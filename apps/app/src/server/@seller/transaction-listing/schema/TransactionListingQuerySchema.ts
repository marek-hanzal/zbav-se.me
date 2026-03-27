import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionListingFilterSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingFilterSchema";
import { TransactionListingSortSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingSortSchema";
import { TransactionListingWhereSchema } from "~/server/@seller/transaction-listing/schema/TransactionListingWhereSchema";

export const TransactionListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionListingFilterSchema.optional(),
		where: TransactionListingWhereSchema.optional(),
		sort: TransactionListingSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "TransactionListingQuery",
		description: "Query object for transaction-listing collection",
	});

export type TransactionListingQuerySchema = typeof TransactionListingQuerySchema;

export namespace TransactionListingQuerySchema {
	export type Type = z.infer<TransactionListingQuerySchema>;
}
