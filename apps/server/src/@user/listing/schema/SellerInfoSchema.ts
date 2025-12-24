import { z } from "@hono/zod-openapi";

export const SellerInfoSchema = z
	.object({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		listings: z.number().openapi({
			description: "Number of listings",
			example: 1,
		}),
		score: z.number().openapi({
			description: "Seller score; 1-6",
			example: 1,
		}),
	})
	.openapi("SellerInfo", {
		description: "Seller info for the listing",
	});

export type SellerInfoSchema = typeof SellerInfoSchema;

export namespace SellerInfoSchema {
	export type Type = z.infer<SellerInfoSchema>;
}
