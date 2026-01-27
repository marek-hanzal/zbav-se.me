import { z } from "@hono/zod-openapi";

export const UserEventSellerScoreSchema = z
	.looseObject({
		score: z.number().openapi({
			description: "Low-level score value, usually not presented in UI",
			example: 0,
		}),
		rank: z.number().openapi({
			description: "Rank computed from the score (A-F, 1-6)",
			example: 2,
		}),
	})
	.strip()
	.openapi("UserEventSellerScore", {
		description: "This metric describes the score of the user",
	});

export type UserEventSellerScoreSchema = typeof UserEventSellerScoreSchema;

export namespace UserEventSellerScoreSchema {
	export type Type = z.infer<UserEventSellerScoreSchema>;
}
