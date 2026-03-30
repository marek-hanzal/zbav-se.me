import { z } from "zod";
import { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";

export const TransactionCountQuerySchema = z
	.looseObject({
		...TransactionQuerySchema.pick({
			filter: true,
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
