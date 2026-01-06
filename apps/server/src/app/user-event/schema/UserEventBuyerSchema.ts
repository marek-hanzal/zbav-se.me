import { z } from "@hono/zod-openapi";
import { UserEventBuyerActivitySchema } from "~/@user/user-event/schema/UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "~/@user/user-event/schema/UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "~/@user/user-event/schema/UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "~/@user/user-event/schema/UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "~/@user/user-event/schema/UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "~/@user/user-event/schema/UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "~/@user/user-event/schema/UserEventBuyerScoreSchema";

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
