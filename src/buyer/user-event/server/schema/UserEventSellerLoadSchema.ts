import { z } from "zod";
import { LoadEnumSchema } from "~/user/user-event/server/schema/LoadEnumSchema";

export const UserEventSellerLoadSchema = z
	.looseObject({
		bucket: LoadEnumSchema.meta({
			description: "Load type of the seller",
			example: "low",
		}),
	})
	.strip()
	.meta({
		id: "UserEventSellerLoad",
		description:
			"Masks number of transactions of the seller, basically it tells, how busy seller is.",
	});

export type UserEventSellerLoadSchema = typeof UserEventSellerLoadSchema;

export namespace UserEventSellerLoadSchema {
	export type Type = z.infer<typeof UserEventSellerLoadSchema>;
}
