import { z } from "@hono/zod-openapi";

export const TransactionSellerInfoSchema = z
	.object({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		score: z.number().openapi({
			description: "Seller score",
			example: 0,
		}),
	})
	.openapi("TransactionSellerInfo", {
		description: "Seller info for the transaction",
	});

export type TransactionSellerInfoSchema = typeof TransactionSellerInfoSchema;

export namespace TransactionSellerInfoSchema {
	export type Type = z.infer<TransactionSellerInfoSchema>;
}
