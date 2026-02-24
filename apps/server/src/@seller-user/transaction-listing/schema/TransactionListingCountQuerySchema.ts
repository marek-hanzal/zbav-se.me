import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { TransactionListingQuerySchema } from "~/@seller-user/transaction-listing/schema/TransactionListingQuerySchema";

export const TransactionListingCountQuerySchema = z
	.looseObject({
		...TransactionListingQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionListingCountQuery", {
		description: "Query object for transaction-listing count",
	});

export type TransactionListingCountQuerySchema = typeof TransactionListingCountQuerySchema;

export namespace TransactionListingCountQuerySchema {
	export type Type = z.infer<TransactionListingCountQuerySchema>;
}
