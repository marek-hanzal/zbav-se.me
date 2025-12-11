import { z } from "@hono/zod-openapi";

export const TransactionBuyerInfoSchema = z
	.object({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		score: z.number().openapi({
			description: "Buyer score",
			example: 0,
		}),
	})
	.openapi("TransactionBuyerInfo", {
		description: "Buyer info for the transaction",
	});

export type TransactionBuyerInfoSchema = typeof TransactionBuyerInfoSchema;

export namespace TransactionBuyerInfoSchema {
	export type Type = z.infer<TransactionBuyerInfoSchema>;
}
