import { z } from "@hono/zod-openapi";

export const TransactionStatusEnumSchema = z
	.enum([
		"pending",
		"open",
		"rejected",
		"completed",
		"cancelled",
		"expired",
	])
	.openapi("TransactionStatusEnum", {
		description: "Current status of the listing transaction",
	});

export type TransactionStatusEnumSchema = typeof TransactionStatusEnumSchema;

export namespace TransactionStatusEnumSchema {
	export type Type = z.infer<TransactionStatusEnumSchema>;
}
