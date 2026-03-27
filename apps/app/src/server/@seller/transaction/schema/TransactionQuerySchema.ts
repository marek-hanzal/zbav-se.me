import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionFilterSchema } from "~/server/@seller/transaction/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/server/@seller/transaction/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/server/@seller/transaction/schema/TransactionWhereSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
		where: TransactionWhereSchema.optional(),
		sort: TransactionSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "TransactionQuery",
		description: "Query object for transaction collection",
	});

export type TransactionQuerySchema = typeof TransactionQuerySchema;

export namespace TransactionQuerySchema {
	export type Type = z.infer<TransactionQuerySchema>;
}
