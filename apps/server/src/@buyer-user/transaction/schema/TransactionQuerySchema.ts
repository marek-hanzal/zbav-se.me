import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionFilterSchema } from "~/@buyer-user/transaction/schema/TransactionFilterSchema";
import { TransactionSortSchema } from "~/@buyer-user/transaction/schema/TransactionSortSchema";
import { TransactionWhereSchema } from "~/@buyer-user/transaction/schema/TransactionWhereSchema";

export const TransactionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: TransactionFilterSchema.optional(),
		where: TransactionWhereSchema.optional(),
		sort: TransactionSortSchema.array().optional(),
	})
	.strip()
	.openapi("TransactionQuery", {
		description: "Query object for transaction collection",
	});

export type TransactionQuerySchema = typeof TransactionQuerySchema;

export namespace TransactionQuerySchema {
	export type Type = z.infer<TransactionQuerySchema>;
}
