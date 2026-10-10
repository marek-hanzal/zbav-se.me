import { z } from "zod";
import { UserEventBuyerActivitySchema } from "~/seller-user-event/schema/UserEventBuyerActivitySchema";
import { UserEventBuyerCloserSchema } from "~/seller-user-event/schema/UserEventBuyerCloserSchema";
import { UserEventBuyerDecisionSchema } from "~/seller-user-event/schema/UserEventBuyerDecisionSchema";
import { UserEventBuyerExpiredSchema } from "~/seller-user-event/schema/UserEventBuyerExpiredSchema";
import { UserEventBuyerLoadSchema } from "~/seller-user-event/schema/UserEventBuyerLoadSchema";
import { UserEventBuyerReactionSchema } from "~/seller-user-event/schema/UserEventBuyerReactionSchema";
import { UserEventBuyerScoreSchema } from "~/seller-user-event/schema/UserEventBuyerScoreSchema";

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
