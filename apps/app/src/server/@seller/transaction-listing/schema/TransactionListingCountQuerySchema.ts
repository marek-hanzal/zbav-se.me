import { z } from "zod";
import { TransactionListingQuerySchema } from "~/server/@seller/transaction-listing/schema/TransactionListingQuerySchema";

export const TransactionListingCountQuerySchema = z
	.looseObject({
		...TransactionListingQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "TransactionListingCountQuery",
		description: "Query object for transaction-listing count",
	});

export type TransactionListingCountQuerySchema = typeof TransactionListingCountQuerySchema;

export namespace TransactionListingCountQuerySchema {
	export type Type = z.infer<TransactionListingCountQuerySchema>;
}
