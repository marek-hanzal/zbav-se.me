import { z } from "@hono/zod-openapi";

export const TransactionEntryTextValueSchema = z
	.looseObject({
		text: z.string().openapi({
			description: "Text entry body",
		}),
	})
	.openapi("TransactionEntryTextValue");

export type TransactionEntryTextValueSchema = typeof TransactionEntryTextValueSchema;

export namespace TransactionEntryTextValueSchema {
	export type Type = z.infer<TransactionEntryTextValueSchema>;
}
