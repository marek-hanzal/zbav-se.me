import { z } from "zod";
import { TransactionFilterSchema } from "~/buyer/transaction/server/schema/TransactionFilterSchema";

export const TransactionWhereSchema = z
	.looseObject({
		...TransactionFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "TransactionWhere",
		description: "App-based filters",
	});

export type TransactionWhereSchema = typeof TransactionWhereSchema;

export namespace TransactionWhereSchema {
	export type Type = z.infer<TransactionWhereSchema>;
}
