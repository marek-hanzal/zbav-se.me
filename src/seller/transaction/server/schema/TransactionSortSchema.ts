import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const TransactionSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
				"expiresAt",
				"lastAt",
				"status",
			])
			.meta({
				id: "TransactionSortField",
				description: "Field of the transaction sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "TransactionSort",
		description: "Sort object for transaction collection",
	});

export type TransactionSortSchema = typeof TransactionSortSchema;

export namespace TransactionSortSchema {
	export type Type = z.infer<TransactionSortSchema>;
}
