import { z } from "zod";
import { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";

export const TransactionCountQuerySchema = z
	.looseObject({
		...TransactionQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "TransactionCountQuery",
		description: "Query object for transaction count",
	});

export type TransactionCountQuerySchema = typeof TransactionCountQuerySchema;

export namespace TransactionCountQuerySchema {
	export type Type = z.infer<TransactionCountQuerySchema>;
}
