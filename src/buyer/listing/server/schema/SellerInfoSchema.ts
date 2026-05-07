import { z } from "zod";
import { UserEventSellerSchema } from "~/buyer/user-event/server/schema/UserEventSellerSchema";

export const SellerInfoSchema = z
	.looseObject({
		registered: z.coerce.date().meta({
			description: "Registration date",
			type: "string",
		}),
		listings: z.number().meta({
			description: "Number of listings",
			example: 1,
		}),
		events: UserEventSellerSchema.nullable().meta({
			description: "Seller info may not be available if we don't have enough data",
		}),
	})
	.strip()
	.meta({
		id: "SellerInfo",
		description: "Seller info for the listing",
	});

export type SellerInfoSchema = typeof SellerInfoSchema;

export namespace SellerInfoSchema {
	export type Type = z.infer<SellerInfoSchema>;
}
