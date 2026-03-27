import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/seller/transaction/server/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/seller/transaction/server/schema/TransactionWhereSchema";

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
