import { z } from "zod";
import { ActivityEnumSchema } from "~/server/@user/user-event/schema/ActivityEnumSchema";

export const UserEventBuyerActivitySchema = z
	.looseObject({
		bucket: ActivityEnumSchema.meta({
			description: "Activity type of the buyer",
			example: "low",
		}),
	})
	.strip()
	.meta({
		id: "UserEventBuyerActivity",
		description: "This metric describes the approx activity of the user",
	});

export type UserEventBuyerActivitySchema = typeof UserEventBuyerActivitySchema;

export namespace UserEventBuyerActivitySchema {
	export type Type = z.infer<UserEventBuyerActivitySchema>;
}
