import { z } from "@hono/zod-openapi";

export const TransactionStatusEnumSchema = z
	.enum([
		"request",
		"accepted",
		"rejected",
		"success",
		"closed",
		"expired",
	])
	.openapi("TransactionStatusEnum", {
		description: "Current status of the listing transaction",
	});

export type TransactionStatusEnumSchema = typeof TransactionStatusEnumSchema;

export namespace TransactionStatusEnumSchema {
	export type Type = z.infer<TransactionStatusEnumSchema>;
}
