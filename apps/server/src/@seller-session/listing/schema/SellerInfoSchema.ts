import { z } from "@hono/zod-openapi";
import { UserEventSellerSchema } from "~/@seller-session/user-event/schema/UserEventSellerSchema";

export const SellerInfoSchema = z
	.looseObject({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		listings: z.number().openapi({
			description: "Number of listings",
			example: 1,
		}),
		events: z
			.xor([
				z.null(),
				UserEventSellerSchema,
			])
			.openapi({
				description: "Seller info may not be available if we don't have enough data",
			}),
	})
	.strip()
	.openapi("SellerInfo", {
		description: "Seller info for the listing",
	});

export type SellerInfoSchema = typeof SellerInfoSchema;

export namespace SellerInfoSchema {
	export type Type = z.infer<SellerInfoSchema>;
}
