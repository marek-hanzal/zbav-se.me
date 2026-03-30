import { z } from "zod";
import { ActivityEnumSchema } from "~/user/user-event/server/schema/ActivityEnumSchema";

export const UserEventSellerActivitySchema = z
	.looseObject({
		bucket: ActivityEnumSchema.meta({
			description: "Activity type of the seller",
			example: "low",
		}),
	})
	.strip()
	.meta({
		id: "UserEventSellerActivity",
		description: "This metric describes the approx activity of the user",
	});

export type UserEventSellerActivitySchema = typeof UserEventSellerActivitySchema;

export namespace UserEventSellerActivitySchema {
	export type Type = z.infer<typeof UserEventSellerActivitySchema>;
}
