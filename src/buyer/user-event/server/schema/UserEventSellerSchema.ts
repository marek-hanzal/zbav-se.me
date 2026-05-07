import { z } from "zod";
import { UserEventSellerActivitySchema } from "~/buyer/user-event/server/schema/UserEventSellerActivitySchema";
import { UserEventSellerExpiredSchema } from "~/buyer/user-event/server/schema/UserEventSellerExpiredSchema";
import { UserEventSellerLoadSchema } from "~/buyer/user-event/server/schema/UserEventSellerLoadSchema";
import { UserEventSellerReactionSchema } from "~/buyer/user-event/server/schema/UserEventSellerReactionSchema";
import { UserEventSellerRejectedSchema } from "~/buyer/user-event/server/schema/UserEventSellerRejectedSchema";
import { UserEventSellerResolvedSchema } from "~/buyer/user-event/server/schema/UserEventSellerResolvedSchema";
import { UserEventSellerScoreSchema } from "~/buyer/user-event/server/schema/UserEventSellerScoreSchema";

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
	.meta({
		id: "UserEventSeller",
		description: "Seller info for the user event",
	});

export type UserEventSellerSchema = typeof UserEventSellerSchema;

export namespace UserEventSellerSchema {
	export type Type = z.infer<UserEventSellerSchema>;
}
