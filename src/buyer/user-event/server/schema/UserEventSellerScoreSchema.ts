import { z } from "zod";

export const UserEventSellerScoreSchema = z
	.looseObject({
		score: z.number().meta({
			description: "Low-level score value, usually not presented in UI",
			example: 0,
		}),
		rank: z.number().meta({
			description: "Rank computed from the score (A-F, 1-6)",
			example: 2,
		}),
	})
	.strip()
	.meta({
		id: "UserEventSellerScore",
		description: "This metric describes the score of the user",
	});

export type UserEventSellerScoreSchema = typeof UserEventSellerScoreSchema;

export namespace UserEventSellerScoreSchema {
	export type Type = z.infer<UserEventSellerScoreSchema>;
}
