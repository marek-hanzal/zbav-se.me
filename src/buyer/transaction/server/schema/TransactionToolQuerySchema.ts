import { z } from "zod";
import { TransactionQuerySchema } from "./TransactionQuerySchema";
import { TransactionToolFilterSchema } from "./TransactionToolFilterSchema";

export const TransactionToolQuerySchema = z
	.looseObject({
		...TransactionQuerySchema.shape,
		filter: TransactionToolFilterSchema.optional(),
		where: TransactionToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "TransactionToolQuery",
		description: "Query object for transaction tools",
	});

export type TransactionToolQuerySchema = typeof TransactionToolQuerySchema;

export namespace TransactionToolQuerySchema {
	export type Type = z.infer<TransactionToolQuerySchema>;
}
