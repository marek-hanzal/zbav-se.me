import { z } from "zod";
import { UserEventBuyerActivitySchema } from "~/seller/user-event/server/schema/UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "~/seller/user-event/server/schema/UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "~/seller/user-event/server/schema/UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "~/seller/user-event/server/schema/UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "~/seller/user-event/server/schema/UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "~/seller/user-event/server/schema/UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "~/seller/user-event/server/schema/UserEventBuyerScoreSchema";

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
	.meta({
		id: "UserEventBuyer",
		description: "Buyer info for the user event",
	});

export type UserEventBuyerSchema = typeof UserEventBuyerSchema;

export namespace UserEventBuyerSchema {
	export type Type = z.infer<UserEventBuyerSchema>;
}
