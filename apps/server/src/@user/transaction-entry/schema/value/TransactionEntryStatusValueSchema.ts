import { z } from "@hono/zod-openapi";

export const TransactionEntryStatusValueSchema = z
	.looseObject({
		text: z.string().openapi({
			description: "Translation key for the system/status timeline entry",
		}),
	})
	.openapi("TransactionEntryStatusValue");

export type TransactionEntryStatusValueSchema = typeof TransactionEntryStatusValueSchema;

export namespace TransactionEntryStatusValueSchema {
	export type Type = z.infer<TransactionEntryStatusValueSchema>;
}
