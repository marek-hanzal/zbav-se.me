import { z } from "@hono/zod-openapi";
import { TransactionStatusTableSchema } from "~/database/@table/TransactionStatusTableSchema";

export const TransactionStatusSchema = z
	.looseObject({
		...TransactionStatusTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.openapi("TransactionStatus", {
		description: "Listing transaction status entry",
	});

export type TransactionStatusSchema = typeof TransactionStatusSchema;

export namespace TransactionStatusSchema {
	export type Type = z.infer<TransactionStatusSchema>;
}
