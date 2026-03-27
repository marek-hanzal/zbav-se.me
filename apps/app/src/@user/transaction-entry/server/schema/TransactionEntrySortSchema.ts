import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const TransactionEntrySortSchema = z
	.looseObject({
		field: z
			.enum([
				"id",
				"createdAt",
			])
			.meta({
				id: "TransactionEntrySortField",
				description: "Sort field for transaction entry collection",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "TransactionEntrySort",
		description: "Sort object for transaction entry collection",
	});

export type TransactionEntrySortSchema = typeof TransactionEntrySortSchema;

export namespace TransactionEntrySortSchema {
	export type Type = z.infer<TransactionEntrySortSchema>;
}
