import { z } from "@hono/zod-openapi";
import { UserEventBuyerActivitySchema } from "~/server/@seller/user-event/schema/UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "~/server/@seller/user-event/schema/UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "~/server/@seller/user-event/schema/UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "~/server/@seller/user-event/schema/UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "~/server/@seller/user-event/schema/UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "~/server/@seller/user-event/schema/UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "~/server/@seller/user-event/schema/UserEventBuyerScoreSchema";

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
