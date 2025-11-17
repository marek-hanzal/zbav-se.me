import { z } from "@hono/zod-openapi";

export const ListingTransactionBuyerInfoSchema = z
	.object({
		score: z.number().openapi({
			description: "Buyer score",
			example: 0,
		}),
	})
	.openapi("ListingTransactionBuyerInfo", {
		description: "Buyer info for the listing transaction",
	});

export type ListingTransactionBuyerInfoSchema = typeof ListingTransactionBuyerInfoSchema;

export namespace ListingTransactionBuyerInfoSchema {
	export type Type = z.infer<ListingTransactionBuyerInfoSchema>;
}
