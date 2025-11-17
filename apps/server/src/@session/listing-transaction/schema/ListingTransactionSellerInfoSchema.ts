import { z } from "@hono/zod-openapi";

export const ListingTransactionSellerInfoSchema = z
	.object({
		score: z.number().openapi({
			description: "Seller score",
			example: 0,
		}),
	})
	.openapi("ListingTransactionSellerInfo", {
		description: "Seller info for the listing transaction",
	});

export type ListingTransactionSellerInfoSchema = typeof ListingTransactionSellerInfoSchema;

export namespace ListingTransactionSellerInfoSchema {
	export type Type = z.infer<ListingTransactionSellerInfoSchema>;
}
