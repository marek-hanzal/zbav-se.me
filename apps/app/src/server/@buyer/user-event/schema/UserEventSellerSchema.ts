import { z } from "zod";
import { UserEventSellerActivitySchema } from "~/server/@buyer/user-event/schema/UserEventSellerActivitySchema";
import { UserEventSellerExpiredSchema } from "~/server/@buyer/user-event/schema/UserEventSellerExpiredSchema";
import { UserEventSellerLoadSchema } from "~/server/@buyer/user-event/schema/UserEventSellerLoadSchema";
import { UserEventSellerReactionSchema } from "~/server/@buyer/user-event/schema/UserEventSellerReactionSchema";
import { UserEventSellerRejectedSchema } from "~/server/@buyer/user-event/schema/UserEventSellerRejectedSchema";
import { UserEventSellerResolvedSchema } from "~/server/@buyer/user-event/schema/UserEventSellerResolvedSchema";
import { UserEventSellerScoreSchema } from "~/server/@buyer/user-event/schema/UserEventSellerScoreSchema";

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
