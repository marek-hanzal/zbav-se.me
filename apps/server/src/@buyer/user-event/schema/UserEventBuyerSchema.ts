import { z } from "@hono/zod-openapi";
import { UserEventBuyerActivitySchema } from "./UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "./UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "./UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "./UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "./UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "./UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "./UserEventBuyerScoreSchema";

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
