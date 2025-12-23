import { z } from "@hono/zod-openapi";

export const SellerInfoSchema = z
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
	.openapi("SellerInfo", {
		description: "Seller info for the listing",
	});

export type SellerInfoSchema = typeof SellerInfoSchema;

export namespace SellerInfoSchema {
	export type Type = z.infer<SellerInfoSchema>;
}
