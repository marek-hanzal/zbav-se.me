import { z } from "@hono/zod-openapi";
import { UserEventSellerActivitySchema } from "./UserEventSellerActivitySchema";
import { UserEventSellerCloserSchema } from "./UserEventSellerCloserSchema";
import { UserEventSellerExpiredSchema } from "./UserEventSellerExpiredSchema";
import { UserEventSellerLoadSchema } from "./UserEventSellerLoadSchema";
import { UserEventSellerReactionSchema } from "./UserEventSellerReactionSchema";
import { UserEventSellerResolvedSchema } from "./UserEventSellerResolvedSchema";
import { UserEventSellerScoreSchema } from "./UserEventSellerScoreSchema";

export const UserEventSellerSchema = z
	.looseObject({
		reaction: UserEventSellerReactionSchema,
		closer: UserEventSellerCloserSchema,
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
