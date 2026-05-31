import { z } from "zod";
import { TransactionQuerySchema } from "./TransactionQuerySchema";
import { TransactionToolWhereSchema } from "./TransactionToolWhereSchema";

export const TransactionToolQuerySchema = z
	.looseObject({
		...TransactionQuerySchema.shape,
		where: TransactionToolWhereSchema.optional(),
	})
	.omit({
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
