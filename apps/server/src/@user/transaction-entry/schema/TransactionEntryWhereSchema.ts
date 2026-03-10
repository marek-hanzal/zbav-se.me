import { z } from "@hono/zod-openapi";
import { TransactionEntryFilterSchema } from "~/@user/transaction-entry/schema/TransactionEntryFilterSchema";

export const TransactionEntryWhereSchema = z
	.looseObject({
		...TransactionEntryFilterSchema.shape,
	})
	.openapi("TransactionEntryWhere", {
		description: "App-level filters for transaction entry queries",
	});

export type TransactionEntryWhereSchema = typeof TransactionEntryWhereSchema;

export namespace TransactionEntryWhereSchema {
	export type Type = z.infer<TransactionEntryWhereSchema>;
}
