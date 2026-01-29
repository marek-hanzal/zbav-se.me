import { z } from "@hono/zod-openapi";
import { UserEventBuyerActivitySchema } from "~/@buyer-session/user-event/schema/UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "~/@buyer-session/user-event/schema/UserEventBuyerScoreSchema";

export const UserEventBuyerSchema = z
	.looseObject({
		reaction: UserEventBuyerReactionSchema,
		closer: UserEventBuyerCloserSchema,
		decision: UserEventBuyerDecisionSchema,
		expired: UserEventBuyerExpiredSchema,
		load: UserEventBuyerLoadSchema,
		activity: UserEventBuyerActivitySchema,
		score: UserEventBuyerScoreSchema,
	})
	.strip()
	.openapi("UserEventBuyer", {
		description: "Buyer info for the user event",
	});

export type UserEventBuyerSchema = typeof UserEventBuyerSchema;

export namespace UserEventBuyerSchema {
	export type Type = z.infer<UserEventBuyerSchema>;
}
