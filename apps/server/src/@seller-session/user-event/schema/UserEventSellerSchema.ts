import { z } from "@hono/zod-openapi";
import { UserEventSellerActivitySchema } from "~/@seller-session/user-event/schema/UserEventSellerActivitySchema";
import { UserEventSellerExpiredSchema } from "~/@seller-session/user-event/schema/UserEventSellerExpiredSchema";
import { UserEventSellerLoadSchema } from "~/@seller-session/user-event/schema/UserEventSellerLoadSchema";
import { UserEventSellerReactionSchema } from "~/@seller-session/user-event/schema/UserEventSellerReactionSchema";
import { UserEventSellerRejectedSchema } from "~/@seller-session/user-event/schema/UserEventSellerRejectedSchema";
import { UserEventSellerResolvedSchema } from "~/@seller-session/user-event/schema/UserEventSellerResolvedSchema";
import { UserEventSellerScoreSchema } from "~/@seller-session/user-event/schema/UserEventSellerScoreSchema";

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
