import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionEntrySortSchema = z
	.looseObject({
		field: z
			.enum([
				"id",
				"createdAt",
			])
			.openapi("TransactionEntrySortField", {
				description: "Sort field for transaction entry collection",
			}),
		order: OrderEnumSchema,
	})
	.openapi("TransactionEntrySort", {
		description: "Sort object for transaction entry collection",
	});

export type TransactionEntrySortSchema = typeof TransactionEntrySortSchema;

export namespace TransactionEntrySortSchema {
	export type Type = z.infer<TransactionEntrySortSchema>;
}
