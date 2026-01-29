import { z } from "@hono/zod-openapi";
import { ActivityEnumSchema } from "~/@common/user-event/schema/ActivityEnumSchema";

export const UserEventBuyerActivitySchema = z
	.looseObject({
		bucket: ActivityEnumSchema.openapi({
			description: "Activity type of the buyer",
			example: "low",
		}),
	})
	.strip()
	.openapi("UserEventBuyerActivity", {
		description: "This metric describes the approx activity of the user",
	});

export type UserEventBuyerActivitySchema = typeof UserEventBuyerActivitySchema;

export namespace UserEventBuyerActivitySchema {
	export type Type = z.infer<UserEventBuyerActivitySchema>;
}
