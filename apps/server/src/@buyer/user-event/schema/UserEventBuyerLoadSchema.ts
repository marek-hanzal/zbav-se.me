import { z } from "@hono/zod-openapi";
import { LoadEnumSchema } from "~/@common/user-event/schema/LoadEnumSchema";

export const UserEventBuyerLoadSchema = z
	.looseObject({
		bucket: LoadEnumSchema.openapi({
			description: "Load type of the buyer",
			example: "low",
		}),
	})
	.strip()
	.openapi("UserEventBuyerLoad", {
		description:
			"Masks number of transactions of the buyer, basically it tells, how busy buyer is.",
	});

export type UserEventBuyerLoadSchema = typeof UserEventBuyerLoadSchema;

export namespace UserEventBuyerLoadSchema {
	export type Type = z.infer<UserEventBuyerLoadSchema>;
}
