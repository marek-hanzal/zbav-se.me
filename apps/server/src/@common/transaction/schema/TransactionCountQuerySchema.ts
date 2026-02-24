import { z } from "@hono/zod-openapi";
import { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";

export const TransactionCountQuerySchema = z
	.looseObject({
		...TransactionQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("TransactionCountQuery", {
		description: "Query object for transaction count",
	});

export type TransactionCountQuerySchema = typeof TransactionCountQuerySchema;

export namespace TransactionCountQuerySchema {
	export type Type = z.infer<TransactionCountQuerySchema>;
}
