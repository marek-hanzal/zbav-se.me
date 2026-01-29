import { z } from "@hono/zod-openapi";
import { LoadEnumSchema } from "~/@common/user-event/schema/LoadEnumSchema";

export const UserEventSellerLoadSchema = z
	.looseObject({
		bucket: LoadEnumSchema.openapi({
			description: "Load type of the seller",
			example: "low",
		}),
	})
	.strip()
	.openapi("UserEventSellerLoad", {
		description:
			"Masks number of transactions of the seller, basically it tells, how busy seller is.",
	});

export type UserEventSellerLoadSchema = typeof UserEventSellerLoadSchema;

export namespace UserEventSellerLoadSchema {
	export type Type = z.infer<UserEventSellerLoadSchema>;
}
