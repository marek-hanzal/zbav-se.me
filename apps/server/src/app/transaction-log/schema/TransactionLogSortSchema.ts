import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionLogSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("TransactionLogSortField", {
				description: "Field of the listing transaction log sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("TransactionLogSort", {
		description: "Sort object for listing transaction log collection",
	});

export type TransactionLogSortSchema = typeof TransactionLogSortSchema;

export namespace TransactionLogSortSchema {
	export type Type = z.infer<TransactionLogSortSchema>;
}
