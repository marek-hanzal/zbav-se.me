import { z } from "@hono/zod-openapi";

export const TransactionEntryLocationValueSchema = z
	.looseObject({
		locationId: z.string().openapi({
			description: "Location identifier linked to this entry",
		}),
	})
	.openapi("TransactionEntryLocationValue");

export type TransactionEntryLocationValueSchema = typeof TransactionEntryLocationValueSchema;

export namespace TransactionEntryLocationValueSchema {
	export type Type = z.infer<TransactionEntryLocationValueSchema>;
}
