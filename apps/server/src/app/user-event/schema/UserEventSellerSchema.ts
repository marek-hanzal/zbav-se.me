import { z } from "@hono/zod-openapi";
import { UserEventSellerActivitySchema } from "~/@user/user-event/schema/UserEventSellerActivitySchema";
import { UserEventSellerExpiredSchema } from "~/@user/user-event/schema/UserEventSellerExpiredSchema";
import { UserEventSellerLoadSchema } from "~/@user/user-event/schema/UserEventSellerLoadSchema";
import { UserEventSellerReactionSchema } from "~/@user/user-event/schema/UserEventSellerReactionSchema";
import { UserEventSellerRejectedSchema } from "~/@user/user-event/schema/UserEventSellerRejectedSchema";
import { UserEventSellerResolvedSchema } from "~/@user/user-event/schema/UserEventSellerResolvedSchema";
import { UserEventSellerScoreSchema } from "~/@user/user-event/schema/UserEventSellerScoreSchema";

export const UserEventSellerSchema = z
	.looseObject({
		reaction: UserEventSellerReactionSchema,
		rejected: UserEventSellerRejectedSchema,
		resolved: UserEventSellerResolvedSchema,
		expired: UserEventSellerExpiredSchema,
		load: UserEventSellerLoadSchema,
		activity: UserEventSellerActivitySchema,
		score: UserEventSellerScoreSchema,
	})
	.strip()
	.openapi("UserEventSeller", {
		description: "Seller info for the user event",
	});

export type UserEventSellerSchema = typeof UserEventSellerSchema;

export namespace UserEventSellerSchema {
	export type Type = z.infer<UserEventSellerSchema>;
}
