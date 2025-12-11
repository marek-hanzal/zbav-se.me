import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const TransactionLocationSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"time",
			])
			.openapi("TransactionLocationSortField", {
				description: "Available sort fields for transaction location",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("TransactionLocationSort", {
		description: "Sort parameters for transaction location collection",
	});

export type TransactionLocationSortSchema = typeof TransactionLocationSortSchema;

export namespace TransactionLocationSortSchema {
	export type Type = z.infer<TransactionLocationSortSchema>;
}
