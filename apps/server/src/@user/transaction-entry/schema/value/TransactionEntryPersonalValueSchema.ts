import { z } from "@hono/zod-openapi";

export const TransactionEntryPersonalValueSchema = z
	.looseObject({
		name: z.string().openapi({
			description: "Contact name",
		}),
		phone: z.string().openapi({
			description: "Contact phone",
		}),
		email: z.email().openapi({
			description: "Contact email",
		}),
		locationId: z.string().openapi({
			description: "Contact location identifier",
		}),
	})
	.openapi("TransactionEntryPersonalValue");

export type TransactionEntryPersonalValueSchema = typeof TransactionEntryPersonalValueSchema;

export namespace TransactionEntryPersonalValueSchema {
	export type Type = z.infer<TransactionEntryPersonalValueSchema>;
}
