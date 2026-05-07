import { z } from "zod";
import { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";

export const TransactionListingWhereSchema = z
	.looseObject({
		...TransactionListingFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "TransactionListingWhere",
		description: "App-based filters",
	});

export type TransactionListingWhereSchema = typeof TransactionListingWhereSchema;

export namespace TransactionListingWhereSchema {
	export type Type = z.infer<TransactionListingWhereSchema>;
}
