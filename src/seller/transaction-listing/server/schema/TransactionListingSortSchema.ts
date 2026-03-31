import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const TransactionListingSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"lastAt",
			])
			.meta({
				id: "TransactionListingSortField",
				description: "Field of the transaction-listing sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "TransactionListingSort",
		description: "Sort object for transaction-listing collection",
	});

export type TransactionListingSortSchema = typeof TransactionListingSortSchema;

export namespace TransactionListingSortSchema {
	export type Type = z.infer<TransactionListingSortSchema>;
}
