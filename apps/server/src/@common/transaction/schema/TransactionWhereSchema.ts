import { z } from "@hono/zod-openapi";
import { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";

export const TransactionWhereSchema = z
	.looseObject({
		...TransactionFilterSchema.shape,
	})
	.strip()
	.openapi("TransactionWhere", {
		description: "App-based filters",
	});

export type TransactionWhereSchema = typeof TransactionWhereSchema;

export namespace TransactionWhereSchema {
	export type Type = z.infer<TransactionWhereSchema>;
}
